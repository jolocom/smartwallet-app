The components and Redux module(s) can be found in the wallet-registration directories in the components/ and redux/modules/ directories. The component

The different screens and their respective container components of the registration process each have their own routes to enable the browser history button functionality and allow for easier testing. They're located in components/screens/ named after their component names. The walkthrough for the registration process can be found at:
https://files.slack.com/files-pri/T03K1SCA9-F4FC09FNX/170308_jolocom_wallet_registrationprocess-07.png

| Route                               | Container component                 | Description                                                      |
| ----------------------------------- | ----------------------------------- | -----------------------------------------------------------------|
| /registration                       | RegistrationNameEntryScreen         | Initial name entry screen                                        |
| /registration/entropy               | RegistrationEntropyScreen           | Entropy gathering screen                                         |
| /registration/user-type             | RegistrationUserTypeScreen          | Expert vs. layman choice                                         |
| /registration/write-phrase          | RegistrationWritePhraseScreen       | Showing of the passphrase confirming writing it down             |
| /registration/phrase-info           | RegistrationPhraseInfoScreen        | Inform user about the implications of Jolocom storing passphrase |
| /registration/pin                   | RegistrationPinScreen               | PIN code entry                                                   |
| /registration/email                 | RegistrationIdentifierScreen        | Enter e-mail                                                     |
| /registration/password              | RegistrationPasswordScreen          | Enter password                                                   |

Redux state
-----------

Located under the registration key of the global state, it contains the following data:

* username (as in first RegistrationNameEntryScreen)
  * value: always a string, initialized as empty string
  * valid: bool - non-empty and checked whether already exists on Jolocom proxy
  * checking: bool - checking for already existing username
  * checked: bool - check
  * errorMsg: string - empty or checking error
* userType: null | "expert" | "layman"
* maskedImage
  * uncovering: bool, whether the image is uncovering, e.g. the user is touching the screen
* passphrase:
  * sufficientEntropy: bool, whether enough entropy has been gathered to generate a secure random string
  * randomString: null or string when enough entropy has been gathered
  * phrase: string, conversion of random string into passphrase the user can write down
  * progress: number - 0 between 1, progress towards having enough entropy to generate random string
  * writtenDown: bool
* pin
  * value
  * valid
  * focused - bool: is the pin input focused?
  * confirm - bool: if true, the pin was entered and the user pressed next, but we are asking for confirmation
* email
  * value
  * valid
* password
  * value: string
  * repeated: string
  * valid: true, non-empty, with digit, uppercase, lowercase and strong enough
  * strength: 'weak' | 'good' | 'strong'
  * hasUpperCase
  * hasLowerCase
  * hasDigit
* wallet
  * registering: bool
  * registered: bool
  * errorMsg: string
* complete: bool, if all fields are filled out and valid

Redux actions
-------------

* goForward() - knows which screen where on, and goes to the correct next screen based on that and other state if current screen is valid
* setUserType(check) - checks type and throws error if necessary
* setMaskedImageUncovering(value: bool)
* addEntropyFromDeltas({x, y, z?}) - add entropy from mouse movement or accelerometers, actual logic is seperate from React/Redux
* setPassphraseWrittenDown(value: bool)
* setEntropyStatus({sufficientEntropy, progress})
* setPassphrase(value)
* setRandomString(value)
* switchToExpertMode()
* setPin(value)
* setPinConfirm(value : bool)
* setPinFocused(value : bool)
* submitPin() - ask for confirmation or go forward if confirmed
* setUsername(value)
* checkUsername(username) - async action, resolves if available
* setEmail(value)
* setPassword(value)
* setRepeatedPassword(value)
* (async) registerWallet()


Name / user type / email / password entry
-----------------------------------------

RegistrationNameEntryScreen is connected to Redux, passing on its data to the pure functional componenent RegistrationNameEntryComponent taking the following props:
* value
* onChange
* onSubmit - connected to goForward()
* valid

The user type, email (and maybe username) and password entry screen follow the same architecture

Entropy gathering
-----------------

The entropy gathering screen has a few components working together:
* RegistrationEntropyScreen: Connected to Redux, passing its data on to RegistrationNameEntryScreen
* RegistrationEntropyComponent
  * Props: imageURL, onMouseMove, onPointRevealed, onSubmit, valid
* MaskedImage: 
  * Props: imageURL, onMouseMove, onPointRevealed, valid
  
Uses passphrase Redux state, and addMaskedImagePoint(), addEntropyFromDeltas()

PIN entry
---------

Again has seperate container and presentation components, with value and valid props. To meet UI requirements, there is an automatically focused and blurred hidden <input type=number> whose value is copied through the shared Redux state and rendered into the balls.

Write passphrase
----------------

Uses passphrase Redux state, and setPassphraseWrittenDown()

Passphrase info
----------------

Uses switchToExpertMode() and goForward()

Masked image
------------

Stores in the Redux state whether the image is uncovering, container component contains state about the uncovered points, and the MaskedImage pure presentation component renders this to an SVG and collects mouse and touch input.
