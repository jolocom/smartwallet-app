fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### get_appstoreconnect_api_key

```sh
[bundle exec] fastlane get_appstoreconnect_api_key
```

Load the App Store Connect API token

### get_appcenter_token

```sh
[bundle exec] fastlane get_appcenter_token
```

Get API token for MS AppCenter

### sentry_auth

```sh
[bundle exec] fastlane sentry_auth
```

Get Sentry Auth Token for iOS and Android

### release

```sh
[bundle exec] fastlane release
```

Release the app to the Test Flight or the App Store

### upload

```sh
[bundle exec] fastlane upload
```



----


## iOS

### ios certificates

```sh
[bundle exec] fastlane ios certificates
```

Fetch certificates and provisioning profiles

### ios build

```sh
[bundle exec] fastlane ios build
```

Fetch certificates. Build the iOS application.

### ios alpha

```sh
[bundle exec] fastlane ios alpha
```

Build iOS application and upload to Appcenter

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Build iOS application and upload to TestFlight

### ios store

```sh
[bundle exec] fastlane ios store
```

Build iOS application and upload to the App Store

----


## Android

### android get_secrets

```sh
[bundle exec] fastlane android get_secrets
```

Clones the secrets repo for android and provides the keystore, the store API key and returns the keystore Password

### android build

```sh
[bundle exec] fastlane android build
```



### android alpha

```sh
[bundle exec] fastlane android alpha
```

Build Android application and upload to Appcenter

### android beta

```sh
[bundle exec] fastlane android beta
```

Submit a new Beta Build to Play Store

### android release

```sh
[bundle exec] fastlane android release
```

Submit a new Release Build to Play Store

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
