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
  CREATE_PASSCODE: 'Create passcode',
  VERIFY_PASSCODE: 'Verify passcode',
  IN_ORDER_TO_PROTECT_YOUR_DATA:
    'In order to protect your data from other users and maintain confidentiality',
  YOU_WONT_BE_ABLE_TO_EASILY_CHECK_IT_AGAIN:
    'You won’t be able to easily check it again, so please memorise it',
}

export const strings = {
  ...loaderMsgs,
  ...entropy,
  ...walkthrough,
  ...errorBoundary,
  ...passcode,
}
