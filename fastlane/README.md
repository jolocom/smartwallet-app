fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
### get_appcenter_token
```
fastlane get_appcenter_token
```
Get API token for MS AppCenter

----

## iOS
### ios certificates
```
fastlane ios certificates
```
Fetch certificates and provisioning profiles
### ios build
```
fastlane ios build
```
Fetch certificates. Build the iOS application.
### ios alpha
```
fastlane ios alpha
```
Build iOS application and upload to Appcenter

----

## Android
### android build
```
fastlane android build
```
Build the Android application
### android alpha
```
fastlane android alpha
```
Build Android application and upload to Appcenter

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
