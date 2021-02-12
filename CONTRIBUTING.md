# Contributing to IJO

:wave: Thanks for considering a contribution to IJO.
This guide will show you how you can contribute to IJO.

## Issues

Whether you've found a bug, or wish to propose a feature, GitHub issues are the best way to suggest changes to IJO.

### Bug Report

Found a bug in IJO?
The best way to get your bug fixed is to open a detailed issue on GitHub. Below are a few things you may consider including in your report.

- The error text (we really need this to identify the problem)
- Any logs relating to the bug
- Additional information you think would be helpful

### Request A Feature

Before requesting a feature, it's best to consider whether or not the feature is better implemented as a plugin. After all, the IJO core contains only the minimum required features. Everything else can be added as a plugin.

When requesting a core feature, be sure to detail exactly what you want, even down to including use-cases of the feature.

## Contributing Code

Wish to contribute code to IJO?
Fantastic!
To get started, you'll need a development environment (we explain how to do this in the [README](README.md#installation)). 

If you wish to add a significant change to IJO, you should first open an issue so it can be discussed. If you wish to work on an issue that is already open, drop a comment to show that you're working on it. 

After adding your code, be sure to run all tests, and link your code with the following.

```bash
npm run test
npm run lint
```

### Pull Requests

Once you've finished working on your addition to IJO, open a pull request to the main repository. Make sure to add a relevent title and description.

Your new code will be subjected to tests.
If all's good, sit back and relax. Someone will be along soon to review your code.
If the tests fail, take a look at the logs and try to fix it.
