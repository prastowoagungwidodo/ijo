const FileSystem = require("fs");
const pify = require("pify");

function loadPlugin(path) {
	let plugin = require(app.utils.path.resolve("plugins/" + path + "/plugin.json"));

	plugin.panel = generateEnvironments(plugin.panel);
	plugin.machine = generateEnvironments(plugin.machine);

	if(!validatePlugin(plugin) || !plugin.panel || !plugin.machine) {
		return;
	}

	return new Plugin(plugin);
}

function generateEnvironments(env) {
	if(env instanceof Array) {
		env.map(function(env) {
			if(typeof env.platform !== "string" || typeof env.lang !== "string" || typeof env.index !== "string") {
				return;
			}

			return new PluginEnvironment(env);
		});
		
		return env.includes(undefined) ? false : env;
	}

	if(typeof env !== "object" || typeof env.platform !== "string" || typeof env.lang !== "string" || typeof env.index !== "string") {
		return;
	}

	return [new PluginEnvironment(env)];
}

function validatePlugin(plugin) {
	if(plugin === undefined) {
		return false;
	}

	if(typeof plugin.name !== "string" || typeof plugin.version !== "string") {
		return false;
	}

	return true;
}

class PluginEnvironment {
	constructor(object) {
		this.platform = object.platform;
		this.language = object.lang;
		this.indexFile = object.index;
		this.includes = object.includes;
		this.excludes = object.excludes;
	}
}

class Plugin {
	constructor(object) {
		this.name = object.name;
		this.description = object.description;
		this.version = object.version;
		this.author = object.author;
		this.license = object.license;
		this.parts = object.parts;
	}
}

module.exports = class PluginManager {
	constructor() {
		this.plugins = new Map();
	}

	async load() {
		var paths = await pify(FileSystem.readdir)(app.utils.path.resolve("plugins/"));

		paths.forEach(function(path) {
			let plugin = loadPlugin(path);

			if(plugin === undefined) {
				return console.error(`The plugin at /panel/plugins/${path} could not be loaded`);
			}
			else if(this.plugins.has(plugin.name)) {
				return console.error(`The plugin ${plugin.name} has already been loaded`);
			}

			this.plugins.set(plugin.name, plugin);
		}.bind(this));
	}
}