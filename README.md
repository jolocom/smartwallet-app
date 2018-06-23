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

### Device Build

#### Android

Please set up an Android development environment. 

Then:

```bash
react-native run-android
yarn android
```
The first command will run and install a debug build on an attached Android device. A terminal window may pop up which starts a Metro Bundler, please stop this process.
The second command will start the Haul bundler and serve the build on your device if both are running on the same network. If remote debugging is enabled, the debugger-ui will also be available here.

#### iOS

Please set up the appropriate XCode development environment.

Then:

```bash
react-native run-ios --device
yarn ios
```

The first command will run and install a debug build on an attached iOS device. A terminal window may pop up which starts a Metro Bundler, please stop this process.
The second command will start the Haul bundler and serve the build on your device if both are running on the same network. If remote debugging is enabled, the debugger-ui will also be available here.

#### Testing

Testing uses Jest. The following script enables watch and testing coverage display as well.

```bash
yarn test --watch --coverage
```

Documentation
-------------
Additional documentation can be found at our [wiki](https://github.com/jolocom/smartwallet-app/wiki).

Copyright (C) 2014-2018  JOLOCOM GmbH
