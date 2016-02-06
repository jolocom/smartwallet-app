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
python utils/soliddata/setup.py develop
```

## Generate test data for single test server (https://localhost:8443)
```
soliddata --blueprint utils/soliddata/local.json --output-dir data --flatten
```

## Building
```bash
gulp
```

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
