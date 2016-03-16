little-sister
=============

[![](https://img.shields.io/badge/project-Solid-7C4DFF.svg?style=flat-square)](https://github.com/solid/solid) [![Dependency Status](https://david-dm.org/jolocom/little-sister/develop.svg)](https://david-dm.org/jolocom/little-sister/develop) [![Stories in Ready](https://badge.waffle.io/jolocom/little-sister.svg?label=ready&title=Ready)](http://waffle.io/jolocom/little-sister)

little-sister - Social app / linked data explorer built for [SoLiD](https://github.com/linkeddata/SoLiD) servers like [rww-play](https://github.com/read-write-web/rww-play) or [gold](https://github.com/linkeddata/gold)

Setup
-----

## Installing dependencies

```bash
npm install -g bower gulp
npm install
bower install
```

## Install python tools for test data generation
```
cd utils/soliddata; python setup.py develop
```
These tools should be installed using python2. Running the `setup.py` using python3 will cause errors in further steps. Please see the next step for extra information.

## Generate test data for single test server (https://localhost:8443)
```
soliddata --blueprint utils/soliddata/local.json --output-dir data --flatten
```
In case this command throws the `object of type 'map' has no len()` error, reinstall the _python tools for test data generation_ using python2 rather than python3. The error is caused by the _rdflib_ library not supporting python3.

## Building
```bash
gulp
```

##Build-Prod
`bash gulp build-prod`has a similar effect to just using `bash gulp`, except it runs some additional, non vital operations (for example asset minimization) that make the final `app.js` file more optimized. </br>Running `gulp-prod` takes more time, and can therefore cause the development feedback cycle to take longer, as a result of that it shouldn't really be used during development.


## Webroot
You have to setup your SoLiD server to point to `dist/` directory (built by `gulp` in the previous step)


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

Copyright (C) 2015  JOLOCOM UG
