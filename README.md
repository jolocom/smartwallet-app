little-sister
=============

[![](https://img.shields.io/badge/project-Solid-7C4DFF.svg?style=flat-square)](https://github.com/solid/solid) [![Dependency Status](https://david-dm.org/jolocom/little-sister/develop.svg)](https://david-dm.org/jolocom/little-sister/develop) [![Stories in Progress](https://badge.waffle.io/jolocom/little-sister.svg?label=in%20progress&title=In%20Progress)](http://waffle.io/jolocom/little-sister)
[![Build Status](https://travis-ci.org/jolocom/little-sister.svg?branch=develop)](https://travis-ci.org/jolocom/little-sister)

little-sister - Social app / linked data explorer built for [SoLiD](https://github.com/linkeddata/SoLiD) servers like [rww-play](https://github.com/read-write-web/rww-play) or [gold](https://github.com/linkeddata/gold)

Setup
-----

## Installing dependencies

```bash
npm install -g gulp
npm install -g solid-server
npm install
```

Try to run `solid`, if it fails make sure the `node` package version >= v6.0.0

If you're on Windows and getting the error `Missing VCBuild` during the installation of solid-server, you need to install the [VC++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools): select both Windows 8.1 and Windows 10 SDKs, and, if you're on Windows 7, also select the .NET Framework. Then, run `npm config set msvs_version 2015 --global` and/or modify the PATH so that msbuild or vcbuild is accessible from the CLI. Install solid-server globally again; ignore potential errors and try running "solid".

## Install ssl certificates for solid-server

Default dev certificate is available in `etc` as `localhost.key` and `localhost.cert`.

For local testing you will also need to generate a ssl-cert and ssl-key, you should be able to do that buy running:
```
openssl genrsa 2048 > ./localhost.key
openssl req -new -x509 -nodes -sha256 -days 3650 -key ./localhost.key -subj '/CN=*.localhost' > ./localhost.cert
```

## Generating base data

For the application to be useful you need a minimum data setup (at least one node representing a user profile). Instead of having to write the RDF files manually you can generate them using a python script.

### Install python tools

Make sure you use python 2.x when installing soliddata, e.g.

```
cd utils/soliddata; python2.7 setup.py develop
```
Running the `setup.py` using python3 will cause errors in further steps.

### Generate testdata for single test server (https://localhost:8443)
```
soliddata --blueprint utils/soliddata/local.json --output-dir data --flatten
```
In case this command throws the `object of type 'map' has no len()` error, reinstall the _python tools for test data generation_ using python2 rather than python3. The error is caused by the _rdflib_ library not supporting python3.

## Building

### With hot module reload support

```bash
gulp
```
This will run the webpack-dev-server on https://localhost:8080 and will reload only the modules you update instead of rebuilding the entire bundle on every change.

### Without hot module reloading

```bash
gulp build-dev
```
Rebuilding will be much slower this way, because the entire bundle will be rebuild on each change.

If you are getting the error `Module parse failed: main.jsx Line 1: Unexpected token`, switch to node version 4.x to run `gulp build-dev` ([nvm](https://github.com/creationix/nvm) might come in handy).

**Warning:** calling "gulp" is dangerous, as it will start the webpack-dev-server which will overshadow ports 8080,8443 that the Gold server uses

###Build-Prod
`bash gulp build`has a similar effect to just using `bash gulp`, except it runs some additional, non vital operations (for example asset minimization) that make the final `app.js` file more optimized. </br>Running `gulp-prod` takes more time, and can therefore cause the development feedback cycle to take longer, as a result of that it shouldn't really be used during development.

## Running

After the app was build you can start the solid-server in the followings ways:

### Run with default configuration

```bash
npm run solid
```

### With explicit parameters from command line

```bash
solid start --port 8443 --ssl-cert ./localhost.cert --ssl-key ./localhost.key --root /path/to/little-sister/dist -v
```

### With config file

Run `solid init` to generate config file or use the following template for `config.json`:

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

For local development/testing environment do not use `webid` and `idp` for now.

## Tests

### Running tests locally

```bash
npm test
```

### Writing tests

Frameworks used for testing: `Mocha`, `Chai`, `Sinon` and `Enzyme`, test are run in `Karma`

1. Write .test.js files directly next to the parts (or in a /test sub folder) of the application that you write the test for.

2. Write your unit and component tests in those files.

3. Run `$ npm test`

## Documentation

Additional documentation can be found at our [wiki](https://github.com/jolocom/little-sister/wiki).


## git-flow

We are using git-flow to manage our branching strategy. More details can be found in [this article](http://nvie.com/posts/a-successful-git-branching-model/). Also, you should install a plugin for your git command line: [nvie/gitflow](https://github.com/nvie/gitflow).

Once you have installed the git flow plugin, you should initialize its branch mappings with this command:
```bash
git flow init -d
```

Copyright (C) 2015-2016  JOLOCOM UG
