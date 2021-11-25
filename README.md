Jolocom SmartWallet - An application to manage your digital identity.

Interested in our vision? Take a look at our [whitepaper](https://jolocom.io/wp-content/uploads/2019/12/Jolocom-Whitepaper-v2.1-A-Decentralized-Open-Source-Solution-for-Digital-Identity-and-Access-Management.pdf).

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/jolocom/SmartWallet)

## Prerequisites

- Set-up requires [Node.js](https://nodejs.org/en/download/) to be installed on your computer.
  - The Jolocom SmartWallet requires `Node.js v12+` to build the project. You can either manually install Node version above 12, or you can delegate it to `Volta` (follow [this link](https://docs.volta.sh/guide/getting-started) to install `Volta`). Node `12.4.1` is pinned to the project
- We use [Yarn](https://yarnpkg.com) as our package manager.
- We use [CocoaPods](https://cocoapods.org/) for `iOS` dependency management.

## Installation

1. Clone the repository to a directory of your choice.
2. `cd` into the cloned repo and run `yarn` from your terminal to install the required depencencies .

### Running a debug version for development

#### Android

3. Please set up an Android development environment and install the required SDKs.
  - The [Getting Started](https://facebook.github.io/react-native/docs/getting-started) guide for React Native may come in handy.
  - Look for the instructions under React Native CLI Quickstart.
4. Connect an Android device and enable USB debugging **OR** start an Android AVD emulator
5. Run `yarn android` to install the application and run it.
  - NOTE: this will start a metro bundler server automatically, with stdout/stderr discarded. You can close this and run `yarn start` to manually start the bundler and receive more detailed output.

### iOS

3. Please set up an appropriate Xcode development environment.
  - The [Getting Started](https://facebook.github.io/react-native/docs/getting-started) guide for React Native may come in handy.
  - Look for the instructions under React Native CLI Quickstart.
4. `cd` into the `ios` folder, and install the native dependencies using the `pod install` command.
5. Run `yarn ios` to install and run the application in an emulator.
  - This will default to an iPhone X emulator.
  - The device can be specified by adding `--simulator` and the device name.
    - e.g. `yarn ios --simulator "iPhone SE"`
  - `NOTE`: this will start a metro bundler server automatically, with stdout/stderr discarded. You can close this and run `yarn start` to manually start the bundler and receive more detailed output.
  - `NOTE`: A debug build can also be built through Xcode.

Running a build on a physical device requires the appropriate code signing certificates.

## Testing
We use Jest + [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/) for unit testing.

To run unit tests with watch and testing coverage:
```bash
yarn test --watch --coverage
```
## Code Style and Formatting

- We use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to keep a consistent style across the codebase.
  - There are plugins available for a range of IDEs and text editors; automatic formatting on save is also supported in some editors.
- Check the `yarn lint:fix` and `yarn prettier:format` scripts.

Copyright (C) 2014-2019 JOLOCOM GmbH


