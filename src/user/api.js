const {ApiModel} = require("ijo-utils");

class UserApi extends ApiModel {
    /**
     * Create an instance of UserAPI
     * @param {ApiServer} apiServer The API server instance to use
     * @param {Users} users The parent user manager
     */
    constructor(apiServer, users) {
        super(apiServer);
        this.log = users.log;

        apiServer.register("/user/create", "POST", (...args) => this.create(users, ...args));
        apiServer.register("/user/login", "POST", (...args) => this.login(users, ...args));
    }

    /**
     * Creates a new user.
     * @param {Users} users The users class.
     * @param {ApiRequest} req The api request.
     * @param {ApiResponse} res The api response.
     */
    async create(users, req, res) {
        const data = await req.bodyAsJSON();
        
        // Validate incoming data
        if (
            !await req.isValidKey(res, "username", "string") ||
            !await req.isValidKey(res, "password", "string")
        ) {return}

        // Check if username is taken
        if (users.collection.data.filter(user => user.username == data.username)[0]) {
            return res.sendError({message: "Username is not available", code: 409});
        }

        const user = users.create({username: data.username, password: data.password});
        await users.collection.addOne(user).catch(e => res.sendError({message: e.message, code: 500}));
        this.log.debug(`New user created: '${user.id}'`, "user-api");

        res.send({data: {message: "Created"}, code: 201});
    }

    /**
     * Logs the user in by creating and sending a new token.
     * @param {Users} users The users class.
     * @param {ApiRequest} req The api request.
     * @param {ApiResponse} res The api response.
     */
    async login(users, req, res) {
        const data = await req.bodyAsJSON();
        const user = await users.collection.findOne({username: data.username});

        if (user === undefined || !user.isEqualPassword(data.password)) {
            return res.sendError({message: "The username and/or password is incorrect.", code: 400});
        }

        this.log.trace(`User logged in: ${user.id}`, "user-api");

        const token = await users.auth.createToken(user.id);

        res.send({data: {message: "Logged in", token}});
    }
}

module.exports = UserApi;
