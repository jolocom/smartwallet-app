The components and Redux module(s) can be found in the wallet/ directories in the components/ and redux/modules/ directories.

The different screens and their respective container components of the wallet each have their own routes to enable the browser history button functionality and allow for easier testing. They're located in components/screens/ named after their component names.

Relevant walkthroughs:
https://files.slack.com/files-pri/T03K1SCA9-F4FDEGVM1/170308_jolocom_wallet_verification-05.jpg
https://files.slack.com/files-pri/T03K1SCA9-F4N1QENKV/170322_jolocom_wallet-10.png

| Route                                        | Container component                 | Description                                                 |
| -------------------------------------------- | ----------------------------------- | ------------------------------------------------------------|
| /wallet                                      | WalletRedirectScreen                | Screen that redirects either to intro or identity section   |
| /wallet/:section                             | WalletTabScreen                     |                                                             |
| /wallet/intro                                | WalletIntroScreen                   |                                                             |
| /wallet/money                                | WalletMoneyScreen                   |                                                             |
| /wallet/identity                             | WalletIdentityScreen                |                                                             |
| /wallet/identity/contact/edit                | WalletContactEditScreen             |                                                             |
| /wallet/identity/passport/add                | WalletPassportAddScreen             |                                                             |
| /wallet/identity/passport/add/photos         | WalletPassportPhotosScreen          |                                                             |
| /wallet/identity/drivers-licence/add         | WalletDriversLicenseAddScreen       |                                                             |
| /wallet/identity/drivers-licence/add/photos  | WalletDriversLicensePhotosScreen    |                                                             |


Redux state: Money screen
=========================

* currency
  * ether
    * loaded: bool
    * amount: number or null

Redux state: Identity screen
============================

* username
  * loaded: bool
  * value: string or null
* phone
  * loaded: bool
  * numbers
    * [zero-based index]
      * type: 'mobile' | 'private' | 'work' | 'other'
      * value: string or null
      * verified: bool or null
* email
  * loaded
  * addresses
    * [zero-based index]
      * type: 'mobile' | 'private' | 'work' | 'other'
      * value: string or null
      * verified: bool or null
* passport
  * loaded: bool
  * verified: bool
  * images
    * frontPage: img
    * backPage: img
  * number: string
  * expirationDate: Date
  * firstName: string
  * lastName: string
  * gender: 'male' | 'female'
  * birthDate: Date
  * birthPlace: string
  * bithCountry: value
  * street: string
  * city: string
  * zip: string
  * state: string
  * country: string

Redux state: Contact edit screen
================================

* phone
  * loaded: bool
  * verifying: null or string containing normalized number
  * numbers
    * [zero-based index]
      * type: 'mobile' | 'private' | 'work' | 'other'
      * value: string or null
      * changed
      * verified: bool or null
* email
  * loaded
  * addresses
    * [zero-based index]
      * type: 'mobile' | 'private' | 'work' | 'other'
      * value: string or null
      * changed
      * verified: bool or null


Redux state: Passport edit screen
================================
* loaded: bool
* showErrors: bool
* focusedGroup: 'person' | 'address' | birthdate' | 'number'
* focusedField: field
* passport
  * locations
    * title
    * streetWithNumber
    * zip
    * city
  * number:
    * value: string
    * valid: bool
  * expirationDate:
    * value: string
    * valid: bool
  * firstName:
    * value: string
    * valid: bool
  * lastName:
    * value: string
    * valid: bool
  * gender: 'male' | 'female'
  * birthDate:
    * value: string
    * valid: bool
  * age: number
  * birthPlace:
    * value: string
    * valid: bool
  * birthCountry:
    * value: string
    * valid: bool
  * showAddress: bool
  * physicalAddres
    * street:
      * value: string
      * valid: bool
    * city:
      * value: string
      * valid: bool
    * zip:
      * value: string
      * valid: bool
    * state:
      * value: string
      * valid: bool
    * country:
      * value: string
      * valid: bool
      // TODO investigate the possible implementations


Actions: Passport edit screen
=============================

* change(field, value): change the value of the given field
* showVerifierLocations()
* chooseCountry()
* chooseGender()
* save(): save the passport fields to the backend
* retrievePassportInformation(): get the passport information from the backend
* cancel(): go back to Identity screen without changing any detail


Parts:
==================

- Menu
  - Seperate menu for wallet
- Wallet home
  - TODO: Shouldn't get started provide something helpful?
    - Only first login, start at money next login
- Tabs
  - Connecting subroutes to tabs
- Money
  - Digital currency
    - Display
    - Details (define!)
  - Bank accounts (define! talk with team)
- Identity
  - Username (discuss with team)
  - Name and surname (discuss with team)
  - Contact
    - Common
      - Save changes (define further)
    - Phone
      - Display
        - Verification status
        - Request verification (link shown on click? what happens with multiple unverified numbers?)
        - Verification popup
        - TODO: define UI in terms of spacing for multiple numbers
      - Edit
        - Add another (define further, leave out additional phone number)
        - Type select box (does changing this invalidate verification? NO! And no fax)
        - Clear button (or delete button? delete on saving empty field)
        - TODO: define UI in terms of spacing for multiple numbers
        - SMS sending
          - Activation code generation and storage
      - Verification screen (how does the user get here? what if it's multiple at once? straight after saving, no multiple)
        - 'Extended pin entry'
    - Email
      - Display
        - Verification status
      - Edit
      - Verify
        - TODO: define when verification starts
        - Send e-mail
        - Verify link
    - Address (define, leave out for now, discuss with team)
  - Passport
    - Take or pick pictures (require front and back)
    - Fields: number, surname, give name, date of birth, age auto update, address? (street, city, state, country select with search)
  - Drivers license

TODO
- User type images
- Entropy screen text and images
- Username checking backend
