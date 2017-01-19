little-sister
=============

[![](https://img.shields.io/badge/project-Solid-7C4DFF.svg?style=flat-square)](https://github.com/solid/solid) [![Dependency Status](https://david-dm.org/jolocom/little-sister/develop.svg)](https://david-dm.org/jolocom/little-sister/develop) [![Stories in Progress](https://badge.waffle.io/jolocom/little-sister.svg?label=in%20progress&title=In%20Progress)](http://waffle.io/jolocom/little-sister)
[![Build Status](https://travis-ci.org/jolocom/little-sister.svg?branch=develop)](https://travis-ci.org/jolocom/little-sister)

little-sister - Social app / linked data explorer built for [SoLiD](https://github.com/linkeddata/SoLiD) servers like [rww-play](https://github.com/read-write-web/rww-play) or [gold](https://github.com/linkeddata/gold)

Setup for development
---------------------

Setup requires Node.JS to be installed on your computer. If you do not have it please see:
https://nodejs.org/en/download/

After cloning the little-sister repository to a directory on your computer. Enter the directory and run the following command:

## Installation
```bash
npm install -g gulp
npm install
```

## Building

### With hot module reloading support

```bash
gulp
```
This will make webpack-dev-server serve Little-Sister on https://localhost:8080 and will reload only the modules you've modified instead of rebuilding the entire bundle on every change. The changes will be applied live to your browser.

### Without hot module reloading

```bash
gulp build-dev
```
Rebuilding will be much slower this way, because the entire bundle will be rebuilt on each change.

### Notes

If you are getting the error `Module parse failed: main.jsx Line 1: Unexpected token`, switch to node version 4.x before running the gulp ([nvm](https://github.com/creationix/nvm) might come in handy).

**Warning:** calling "gulp" can be dangerous, as it will start the webpack-dev-server which will overshadow ports 8080, 8443 that the Gold server uses.

Setup for production
--------------------

## Installation
```bash
npm install -g gulp
npm install --production
```

## Building
                 
```bash
gulp build
```

`gulp build` has a similar effect to just using `gulp`, except it runs some additional, non vital operations (for example asset minimization) that make the final `app.js` file more optimized.

Running `gulp build` takes more time, and can therefore cause the development feedback cycle to take longer. Consequently, it shouldn't really be used during development.

Choosing a SoLiD server
-----------------------

Little Sister lets you explore linked data, based on WebID. Here are the solutions we suggest to get your own WebID and make linked data.
  
## Using the Jolocom WebID proxy.
Simply sign up on Little Sister application.

You can switch to another WebID proxy in the `config/` folder.

## Registering manually to a WebID provider (soon supported)
Create an account on [Databox](https://databox.me/) for example and save the certificates on your browser.

Log in to Little Sister using those client certificates.
    
## Running a Solid server locally (self-hosting) (soon supported)
You can run a Solid server locally, for instance [node-solid-server](https://github.com/solid/node-solid-server), to host data on your computer/server. We have prepared tools to get you started with some example base data. Do note that Solid can also be used as a a webserver and serve the Little-Sister application.

## Install solid-server

```bash
npm install -g solid-server
```

Try to run `solid`. If it fails make sure that your `node` package version is >= v6.0.0

If you're on Windows and getting the error `Missing VCBuild` during the installation of solid-server, you need to install the [VC++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools): select both Windows 8.1 and Windows 10 SDKs, and, if you're on Windows 7, also select the .NET Framework. Then, run `npm config set msvs_version 2015 --global` and/or modify the PATH so that msbuild or vcbuild is accessible from the CLI. Install solid-server globally again; ignore potential errors and try running "solid".

## Set up the SSL certificates for solid-server

For local testing you will also need to generate a ssl-cert and ssl-key, you should be able to do that by running:
```
openssl genrsa 2048 > ./localhost.key
openssl req -new -x509 -nodes -sha256 -days 3650 -key ./localhost.key -subj '/CN=*.localhost' > ./localhost.cert
```

Else, default development certificates are available in `etc` as `localhost.key` and `localhost.cert`.

## Generate test data

For the application to be useful you need a minimum data setup (at least one node representing a user profile). Instead of having to write the RDF files manually you can generate them using a python script.

### Install python tools

Make sure you use python 2.x when installing soliddata.

```
cd utils/soliddata; python2.7 setup.py develop
```
Running `setup.py` using python3 will cause errors in the next steps.

### Create the test data files
```
soliddata --blueprint utils/soliddata/local.json --output-dir data --flatten
```
In case this command throws the `object of type 'map' has no len()` error, reinstall the _python tools for test data generation_ using python2 rather than python3. The error is caused by the _rdflib_ library not supporting python3.

### Running

You can start the solid-server in the followings ways:

- With default configuration

```bash
npm run solid
```

- With explicit parameters from command line

```bash
solid start --port 8443 --ssl-cert ./localhost.cert --ssl-key ./localhost.key --root /path/to/little-sister/dist -v
```

- With the config file

Run `solid init` to generate the config file or use the following template for `config.json`:

```json
{
  "root": "/path/to/little-sister/dist",
  "port": "8443",
  "webid": false,
  "sslKey": "./localhost.key",
  "sslCert": "./localhost.cert",
  "idp": false,
  "fileBrowser": "https://linkeddata.github.io/warp/#/list/",
  "dataBrowser": false,
  "strictOrigin": false
}
```

This will host a SoLiD server on your computer as well as serve the Little Sister application.

Tests
-----

## Running tests locally

```bash
npm test
```

## Writing tests

Frameworks used for testing: `Mocha`, `Chai`, `Sinon` and `Enzyme`. Tests are run in `Karma`

1. Create a .test.js file either in the same directory as the file you're writing a test for, or in a /test subfolder.

2. Write your unit and component tests in this file.

3. Run `$ npm test`


Documentation
-------------
Additional documentation can be found at our [wiki](https://github.com/jolocom/little-sister/wiki).


git-flow
--------

We are using git-flow to manage our branching strategy. More details can be found in [this article](http://nvie.com/posts/a-successful-git-branching-model/). Also, you should install a plugin for your git command line: [nvie/gitflow](https://github.com/nvie/gitflow).

Once you have installed the git flow plugin, you should initialize its branch mappings with this command:
```bash
git flow init -d
```

Copyright (C) 2015-2016  JOLOCOM UG
