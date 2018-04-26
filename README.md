[![Dependency Status](https://david-dm.org/jolocom/smartwallet-app/develop.svg)](https://david-dm.org/jolocom/smartwallet-app/develop)[![Build Status](https://travis-ci.org/jolocom/smartwallet-app.svg?branch=develop)](https://travis-ci.org/jolocom/smartwallet-app)

Jolocom SmartWallet - An application to manage your digital identity.

Setup for development
---------------------

Setup requires Node.JS to be installed on your computer. If you do not have it please see:
https://nodejs.org/en/download/

## Installation

Prerequisites:
- [yarn](https://yarnpkg.com)

After cloning the smartwallet-app repository to a directory on your computer, enter the directory and run the following command:

```bash
yarn install
```

### Browser

#### With hot module reloading support

```bash
yarn start
```
This will make webpack-dev-server serve the application on https://localhost:8080 and will reload only the modules you've modified instead of rebuilding the entire bundle on every change. The changes will be applied live to your browser.

#### Without hot module reloading

```bash
yarn build:dev
```
Rebuilding will be much slower this way, because the entire bundle will be rebuilt on each change.

### Notes

If you are getting the error `Module parse failed: main.jsx Line 1: Unexpected token`, switch to node version 4.x before running the gulp ([nvm](https://github.com/creationix/nvm) might come in handy).

Setup for production (iOS)
--------------------

## Installation
```bash
yarn install
```

### Preparing a production bundle

```bash
haul bundle --platform ios --bundle-output ios/smartwallet/main.jsbundle --assets-dest ios
```

### Setting jsCodeLocation to be the bundled js

Open ios/smartwallet/AppDelegate.m and switch jsCodeLocation to be production build (comment our the development one).


Documentation
-------------
Additional documentation can be found at our [wiki](https://github.com/jolocom/smartwallet/wiki).


git-flow
--------

We are using git-flow to manage our branching strategy. More details can be found in [this article](http://nvie.com/posts/a-successful-git-branching-model/). Also, you should install a plugin for your git command line: [nvie/gitflow](https://github.com/nvie/gitflow).

Once you have installed the git flow plugin, you should initialize its branch mappings with this command:
```bash
git flow init -d
```

Copyright (C) 2014-2017  JOLOCOM UG
