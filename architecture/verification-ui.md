The components and Redux module(s) can be found in the verification/ directories in the components/ and redux/modules/ directories.

The different screens and their respective container components of the verification process each have their own routes. They're located in components/verification/screens named after their component names. The walkthrough for the verification process can be found at:
https://jolocom.slack.com/files/sabine/F5PHSRQJV/170607_jolocom_wallet_institutional_verification.png

| Route                               | Container component           | Description                                           |
| ----------------------------------- | ----------------------------- | ----------------------------------------------------- |
| /verification                       | VerificationTransitionScreen  | home page of the verification process                 |
| /verification/face                  | VerificationFaceScreen        | Face checking page of the verification process        |
| /verification/data                  | VerificationDataSScreen       | Data checking page of the verification process        |
| /verification/result                | VerificationResultScreen      | checking result page of the verification process      |

Redux state
------------

* verification:
  * result :
    * numberOfFailngAttempts
    * message
  * face :
    * isFaceMatchingId
  * transition :
    * currentStep
  * data :
    * focusedGroup: 'person' | 'address' | birthdate' | 'number'
    * focusedField: field
    * idCard
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

Transition Screen Actions
-------------------------

* startFaceCheck()
* startDataCheck()
* RequestVerification()
