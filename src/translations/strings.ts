const loaderMsgs = {
  CREATING: 'Creating your personal secret number',
  MATCHING: 'Matching two instances',
  SUCCESS: 'Success!',
  FAILED: 'Failed',
  LOADING: 'Loading',
  EMPTY: '',
}

const entropy = {
  SET_UP_YOUR_IDENTITY: 'Set up your identity',
  TAP_THE_SCREEN_AND_DRAW_RANDOMLY_ON_IT_UNTIL_YOU_COLLECT_100:
    'Tap the screen and draw randomly on it until you collect 100%',
}

export const recovery = {
  RECOVERY: 'Recovery',
  START_ENTERING_SEED_PHRASE:
    'Start entering your seed-phrase word by word and it will appear here',
  CANT_MATCH_WORD: "Can't match this word",
  WHAT_IF_I_FORGOT: 'What if I forgot my phrase?',
  CONFIRM: 'Confirm',
  BACK_TO_WALKTHROUGH: 'Back to walkthrough',
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
  YOU_WONT_BE_ABLE_TO_EASILY_CHECK_IT_AGAIN:
    'You won’t be able to easily check it again, so please memorise it',
  PINS_DONT_MATCH: "PINs don't match",
}
const seedphrase = {
  HOLD_YOUR_FINGER_ON_THE_CIRCLE:
    'Hold your finger on the circle untill magic will happen',
  WRITE_DOWN_THIS_PHRASE_ITS_VERY_IMPORTANT:
    "Write down this phrase. It's very important!",
  OKAY: 'Okay',
  WHY_SO_ANALOGUE: 'Why so analogue?',
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
}
