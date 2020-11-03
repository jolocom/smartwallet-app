import { AttrKeys } from '~/types/credentials'

const loaderMsgs = {
  CREATING: 'Creating your personal secret number',
  MATCHING: 'Matching two instances',
  SUCCESS: 'Success!',
  FAILED: 'Failed',
  LOADING: 'Loading',
  EMPTY: '',
}

const entropy = {
  SET_UP_YOUR_IDENTITY: 'Add uniqueness',
  TAP_THE_SCREEN_AND_DRAW_RANDOMLY_ON_IT_UNTIL_YOU_COLLECT_100:
    'Randomly draw untill 100% to secure your identity',
}

export const recovery = {
  RECOVERY: 'Recovery',
  START_ENTERING_SEED_PHRASE:
    'Start entering your seed-phrase word by word and it will appear here',
  CANT_MATCH_WORD: "Can't match this word",
  WHAT_IF_I_FORGOT: 'What if I forgot my phrase?',
  CONFIRM: 'Confirm',
  BACK: 'Back',
}

const walkthrough = {
  GET_STARTED: 'Get started',
  NEED_RESTORE: 'Need restore?',
  BE_THE_ONLY_ONE: 'Be the only one',
  CONTROL_YOUR_OWN_PERSONAL_INFORMATION:
    'Control your own personal information to stay safe online and off. No third party tracking and creepy ads.',
  GET_WHERE_YOU_NEED_TO_GO: 'Get where you need to go',
  UNLOCK_DOORS:
    'Unlock doors, login to websites, and get access by sharing only the info you need to swiftly and securely',
  NEVER_LOOSE_DATA: 'Never loose data',
  KEEP_ALL_YOUR_INFO_BACKED_UP:
    'Keep all your info backed up and in the right hands - aka yours',
  PROOVE_YOURE_YOU: "Prove you're you",
  UNIQUE_DIGITAL_IDENTITY_TECHNOLOGY:
    'Unique digital identity technology with fully encrypted data for the services you use every day',
}

const errorBoundary = {
  UNKNOWN_ERROR: 'Unknown Error',
  AND_IF_THIS_IS_NOT_THE_FIRST_TIME_WE_STRONGLY_RECOMMEND_LETTING_US_KNOW:
    'And if this is not the first time we strongly recommend letting us know',
  CLOSE: 'Close',
}

const passcode = {
  CREATE_PASSCODE: 'Create PIN',
  VERIFY_PASSCODE: 'Verify PIN',
  IN_ORDER_TO_PROTECT_YOUR_DATA:
    'In order to protect your data from other users and maintain confidentiality',
  ADDING_AN_EXTRA_LAYER_OF_SECURITY:
    'Adding an extra layer of security helps prevent unwanted access to your wallet',
  PINS_DONT_MATCH: "PINs don't match",
}
const seedphrase = {
  HOLD_YOUR_FINGER_ON_THE_CIRCLE: 'Place your finger on the circle ',
  WRITE_DOWN_THIS_PHRASE_SOMEWHERE_SAFE:
    'Write down the collection of words exactly as shown above. Keep this safe!',
  DONE: 'Done',
  WHY_SO_ANALOGUE: 'Why so analogue?',
  YOU_CAN_CHANGE_THE_PASSCODE:
    'You can change the passcode later by using your secret phrase',
}

const deviceAuthentication = {
  USE_TOUCH_ID_TO_AUTHORIZE: 'Use Touch ID to authorise wallet',
  USE_FACE_ID_TO_AUTHORIZE: 'Use Face ID to authorise wallet',
  USE_FINGERPRINT_TO_AUTHORIZE: 'Use Fingerprint to authorise wallet',
  USE_FACE_TO_AUTHORIZE: 'Use your Face to authorise wallet', // a terrible wording here

  TAP_TO_ACTIVATE_TOUCH_ID:
    'Tap to activate Touch ID so you don’t need to confirm your PIN every time you need to use it',
  TAP_TO_ACTIVATE_FACE_ID:
    'Tap to activate Face ID so you don’t need to confirm your PIN every time you need to use it',
  TAP_TO_ACTIVATE_FINGERPRINT:
    'Tap to activate Fingerprint so you don’t need to confirm your PIN every time you need to use it',
  TAP_TO_ACTIVATE_FACE:
    'Tap to activate Face so you don’t need to confirm your PIN every time you need to use it',

  SO_YOU_DONT_NEED_TO_CONFIRM:
    'So you don’t need to confirm your PIN every time you need to use it',

  SKIP: 'Skip',
  YOUR_PIN_WAS_SET_UP: 'Your PIN was set up',

  TOUCH_ID_IS_DISABLED: 'Touch ID is disabled',
  FACE_ID_IS_DISABLED: 'Touch ID is disabled',
  FINGERPRINT_IS_DISABLED: 'Touch ID is disabled',
  FACE_IS_DISABLED: 'Touch ID is disabled',

  TO_USE_BIOMETRICS_ENABLE:
    'To use biometrics enable this feature in the system settings',
  SETTINGS: 'Settings',
  CANCEL: 'Cancel',

  SCAN_YOUR_FINGERPRINT_ON_THE_DEVICE_SCANNER:
    'Scan your fingerprint on the device scanner to continue',
  SCAN_YOUR_FACE: 'Scan your face to continue', // this definitely should be changed
  RESET: 'Reset',
  RESTORE_ACCESS: 'Restore access',
}

const scanner = {
  CAMERA_PERMISSION: 'Camera Permission',
  YOU_CANT_SCAN_WITHOUT_MAIN_FUNCTION:
    "You can't scan without main function. Please allow permisson in your settings",
  TAP_TO_ACTIVATE_CAMERA: 'Tap to activate camera',
  IS_THIS_THE_RIGHT_QR_CODE_TRY_AGAIN: 'Is this the right QR code? Try again.',
  LOOKS_LIKE_WE_CANT_PROVIDE_THIS_SERVICE:
    "Looks like we can't provide this service",
  ITS_ALL_AUTOMATIC_JUST_PLACE_YOUR_PHONE_ABOVE_THE_CODE:
    "It's all automatic, just place your phone above the code",
}

const interactions = {
  AUTHENTICATE: 'Authenticate',
  AUTHORIZE: 'Authorize',
  PULL_TO_CHOOSE: 'Pull to choose',
  SHARE: 'Share',
  RECEIVE: 'Receive',
  IGNORE: 'Ignore',
  CHOOSE_ONE_OR_MORE_DOCUMENTS:
    'Choose one or more documents provided by this service and we will generate them for you',
  DOCUMENTS: 'Documents',
  OTHER: 'Other',
  ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION: `Once you click done, it will be displayed in the personal info section.`,
  //FIXME: when we add i18t for translations, we can interpolate values with %{VALUE}
  THIS_PUBLIC_PROFILE_CHOSE_TO_REMAIN_ANONYMOUS: (did: string) =>
    `This public profile ${did} chose to remain anonymous. Pay attention before sharing data.`,
  SERVICE_IS_NOW_READY_TO_GRANT_YOU_ACCESS: (service: string) =>
    `${service} would like to confirm your digital identity before proceeding`,
  SERVICE_WOULD_LIKE_TO_CONFIRM_YOUR_DIGITAL_IDENTITY: (service: string) =>
    `${service} would like to confirm your digital identity before proceeding`,
  SERVICE: 'Service',
  CHOOSE_ONE_OR_MORE_DOCUMETS_REQUESTED_BY_SERVICE_TO_PROCEED: (
    service: string,
  ) => `Choose one or more documents requested by ${service} to proceed `,
  SERVICE_SENT_YOUR_WALLET_THE_FOLLOWING_DOCUMENTS: (service: string) =>
    `${service} sent your wallet the following document(s):`,
  ADD_YOUR_ATTRIBUTE: (attr: string) => `Add your ${attr}`,
  IS_IT_REALLY_YOU: 'Is it really you?',
  INCOMING_INTERACTION: `Incoming interaction`,
  SERVICE_REQUESTS_ATTRIBUTE: (service: string, attribute: string) =>
    `${service} requests ${attribute}`,
  INCOMING_REQUEST: 'Incoming request',
  INCOMING_OFFER: 'Incoming offer',
  ADD_INFO: 'Add info',
  WOULD_YOU_LIKE_TO_ACTION: (action: string) => `Would you like to ${action}?`,
}

const lock = {
  ENTER_YOUR_PIN: 'Enter your PIN',
  FORGOT_YOUR_PIN: 'Forgot your PIN?',
  UNLOCK_WITH_BIOMETRY: 'Unlock the app with biometry',
  I_WILL_USE_PIN_INSTEAD: 'Use PIN instead',
  TAP_TO_ACTIVATE: 'Tap to activate',
}

const settings = {
  APP_PREFERENCES: 'App preferences',
  LANGUAGE: 'Language',
  SECURITY: 'Security',
  CHANGE_PIN: 'Change PIN',
  GENERAL: 'General',
  FAQ: 'FAQ',
  CONTACT_US: 'Contact us',
  RATE_US: 'Rate us',
  ABOUT: 'About',
  IMPRINT: 'Imprint',
  CURRENT_PASSCODE: 'Current passcode',
  CREATE_NEW_PASSCODE: 'Create new passcode',
  WRONG_PIN: 'Wrong PIN',
  PASSWORD_SUCCESSFULLY_CHANGED: 'PIN successfully changed!',
  LOG_OUT: 'Log out',
}

const attributes = {
  CREATE_NEW_ONE: 'Create new one',
  NAME: 'Name',
  EMAILADDRESS: 'Email',
  MOBILEPHONENUMBER: 'Number',
  MISSING_INFO: 'Missing info',
  SAVE_YOUR_ATTRIBUTE: (attr: AttrKeys) => `Save your attribute ${attr}`,
}

const recoverPin = {
  REPEAT_YOUR_PHRASE: 'Repeat your phrase',
  WORD_BY_WORD: 'word by word',
  STORING_NO_AFFECT_DATA:
    'Setting a new passcode will not affect your stored data',
  HOW_TO_CHANGE_PIN: 'How to change your PIN',
  WE_ARE_SORRY_THAT_YOU_FORGOT:
    'We are very sorry that you forgot your password and may not have access to your wallet, but no worries there is a soluton!',
  YOU_CAN_CHANGE_PIN:
    'You can change your passcode by entering your secret phrase. Click Restore Access below to make the change',
}


export const strings = {
  ...loaderMsgs,
  ...errorBoundary,
  ...passcode,
  ...walkthrough,
  ...entropy,
  ...recovery,
  ...seedphrase,
  ...deviceAuthentication,
  ...scanner,
  ...settings,
  ...lock,
  ...interactions,
  ...attributes,
  ...recoverPin,
}
