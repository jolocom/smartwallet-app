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
  ENTROPY_LOADER: 'Awesome!\nIdentity is being secured',
}

export const recovery = {
  RECOVERY: 'Recovery',
  START_ENTERING_SEED_PHRASE:
    'Start entering your seed-phrase word by word and it will appear here',
  CANT_MATCH_WORD: "Can't match this word",
  WHAT_IF_I_FORGOT: 'What if I forgot my phrase?',
  CONFIRM: 'Confirm',
  BACK: 'Back',
  WHAT_TO_DO_IF_YOU_FORGOT_YOUR_SECRET_PHRASE:
    'What to do if you forgot your secret phrase',
  CONTINUE: 'Continue',
  FORGOT_SEED_INFO_HIGHLIGHT_1:
    'Without your secret phrase you will not be able to re-activate your identity.',
  FORGOT_SEED_INFO_HIGHLIGHT_2:
    'Recovering your entire wallet requires both the secret phrase and a backup file.',
  FORGOT_SEED_INFO_3:
    'Are you sure you do not have a copy stored somewhere safe?',
  FORGOT_SEED_INFO_HIGHLIGHT_4:
    'Think back to when you first created your identity…',
  EXIT_RECOVERY: 'Exit Recovery',
}

const walkthrough = {
  GET_STARTED: 'Get started',
  NEED_RESTORE: 'Need restore?',
  WALKTHROUGH_TITLE_STEP_1: 'Control your data',
  WALKTHROUGH_DESCRIPTION_STEP_1:
    'Manage your digital identity to stay safe online and off',
  WALKTHROUGH_TITLE_STEP_2: 'Use your identity',
  WALKTHROUGH_DESCRIPTION_STEP_2:
    'Get where you need to go with convenient access to apps & services',
  WALKTHROUGH_TITLE_STEP_3: 'Easy backup',
  WALKTHROUGH_DESCRIPTION_STEP_3:
    'Keep all your info backed up and in the right hands - a.k.a. yours',
}

const errors = {
  RESTART_APPLICATION: 'Restart application',
  SUBMIT_REPORT: 'Submit report',
  UNKNOWN_ERROR: 'Unknown Error',
  AND_IF_THIS_IS_NOT_THE_FIRST_TIME_WE_STRONGLY_RECOMMEND_LETTING_US_KNOW:
    'And if this is not the first time we strongly recommend letting us know',
  CLOSE: 'Close',
  SYSTEM_CRASH: 'System crash',
  BUT_DONT_WORRY_YOUR_DATA_IS_SAFE:
    'But don’t worry - your data is safe and nothing will be lost',
  INCLUDE_LOGS: 'Include logs',
  ERROR_REPORTING_LOGS_WARNING:
    'This includes certain private metadata info (like file sizes - but not personal information) and will help developers fix bugs even quicker',
  ERROR_REPORTING_RATE: 'Rate the issue',
  NO_INTERNET_CONNECTION: 'No internet connection',
  THE_APP_KEEPS_CRASHING: 'The app keeps crashing',
  CANT_LOGIN: "Can't login",
  BACKUP_IS_EMPTY: 'Backup is empty',
  PROBLEMS_WITH_THE_INTERFACE: 'Problems with the interface',
  SOMETHING_DOESNT_SEEM_RIGHT: "Something doesn't seem right",
}

const passcode = {
  CREATE_PASSCODE: 'Create passcode',
  VERIFY_PASSCODE: 'Verify passcode',
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
  WHY_THESE_WORDS_ARE_IMPORTANT_TO_YOU: 'Why these words are important to you',
  GOT_THIS: 'Got this',
  SEEDPHRASE_INFO_1:
    'Your wallet will store very sensitive data about you. We want to make sure that you keep it safe right from the start.',
  SEEDPHRASE_INFO_HIGHLIGHT_2: 'Only this unique set of words',
  SEEDPHRASE_INFO_3:
    'can be used to regenerate your identity when your phone is lost or broken.',
  SEEDPHRASE_INFO_HIGHLIGHT_4:
    'We strongly recommend storing your set of words in a safe place. Writing it down or using an encrypted password manager are the best options.',
  SEEDPHRASE_INFO_5: 'Do not share your secret phrase with anyone.',
  DRAG_AND_DROP_THE_WORDS: (isFirst: boolean) =>
    `Drag and drop ${
      isFirst ? 'first' : 'last'
    } 6 words until they are in the correct order`,
  CHECK_CAREFULLY_FOR_MISTAKES_AND_TRY_AGAIN:
    'Check carefully for mistakes and try again',
  SEEDPHRASE_GO_BACK: 'Back to walkthrough',
}

const walletAuthentication = {
  USE_TOUCH_ID_TO_AUTHORIZE: 'Use Touch ID to authorise wallet',
  USE_FACE_ID_TO_AUTHORIZE: 'Use Face ID to authorise wallet',
  USE_BIOMETRICS_TO_AUTHORIZE: 'Use Biometrics to authorise wallet',

  SO_YOU_DONT_NEED_TO_CONFIRM:
    'So you don’t need to confirm your passcode every time you need to use it',

  SKIP: 'Skip',
  YOUR_PIN_WAS_SET_UP: 'Your PIN was set up',

  CANCEL: 'Cancel',

  SCAN_YOUR_FINGERPRINT_ON_THE_DEVICE_SCANNER:
    'Scan your fingerprint on the device scanner to continue',
  SCAN_YOUR_FACE: 'Scan your face to continue', // this definitely should be changed
  PROVIDE_BIOMETRICS: 'Provide biometrics to continue',
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
  LOCAL_PERMISSION_DIALOG:
    'To activate devices within the local network please allow access for the SmartWallet.',
  MANAGE: 'Manage',
  TAP_TO_MANAGE: 'Tap to manage',
}

const interactions = {
  AUTHENTICATE: 'Authenticate',
  AUTHORIZE: 'Authorize',
  SHARE: 'Share',
  RECEIVE: 'Receive',
  IGNORE: 'Ignore',
  DOCUMENTS: 'Documents',
  OTHER: 'Other',
  ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION: `Once you click done, it will be displayed in the personal info section.`,
  THIS_PUBLIC_PROFILE_CHOSE_TO_REMAIN_ANONYMOUS:
    'This public profile {{did}} chose to remain anonymous. Pay attention before sharing data.',
  SERVICE_IS_NOW_READY_TO_GRANT_YOU_ACCESS:
    '{{service}} is now ready to grant you access',
  SERVICE_WOULD_LIKE_TO_CONFIRM_YOUR_DIGITAL_IDENTITY:
    '{{service}} would like to confirm your digital identity before proceeding',
  CHOOSE_ONE_OR_MORE_DOCUMENTS_REQUESTED_BY_SERVICE_TO_PROCEED:
    'Choose one or more documents requested by {{service}} to proceed',
  SERVICE_SENT_YOUR_WALLET_THE_FOLLOWING_DOCUMENTS:
    '{{service}} sent your wallet the following document(s)',
  ADD_YOUR_ATTRIBUTE: 'Add your {{attribute}}',
  IS_IT_REALLY_YOU: 'Is it really you?',
  INCOMING_REQUEST: 'Incoming request',
  INCOMING_OFFER: 'Incoming offer',
  ADD_INFO: 'Add info',
  INCLUDED_INFO: 'Included info',
  NO_INFO_THAT_CAN_BE_PREVIEWED: 'No info that can be previewed',
  WOULD_YOU_LIKE_TO_ACTION: 'Would you like to {{action}}?',
  INTERACTION_ERROR_TITLE: 'Interaction error',
  INTERACTION_ERROR_MESSAGE:
    'Unknown interaction error occurred. Please submit report',
  ERROR_ATTRIBUTE_ALREADY_EXISTS: 'Attribute of the same value already exists',
  INTERACTION_DESC_MISSING_SINGLE:
    'It seems like your wallet is missing something important for this request',
  INCOMING_REQUEST_SINGLE: '{{service}} requests {{attribute}}',
}

const lock = {
  ENTER_YOUR_PASSCODE: 'Enter your passcode',
  FORGOT_YOUR_PASSCODE: 'Forgot your passcode?',
  UNLOCK_WITH_BIOMETRY: 'Unlock the app with biometry',
  I_WILL_USE_PIN_INSTEAD: 'Use PIN instead',
  TAP_TO_ACTIVATE: 'Tap to activate',
}

const settings = {
  APP_PREFERENCES: 'App preferences',
  LANGUAGE: 'Language',
  SECURITY: 'Security',
  CHANGE_PASSCODE: 'Change passcode',
  USE_BIOMETRICS_TO_LOGIN: 'Use Biometrics to log in',
  BACKUP_IDENTITY: 'Backup Identity',
  GENERAL: 'General',
  FAQ: 'FAQ',
  CONTACT_US: 'Contact us',
  RATE_US: 'Rate us',
  ABOUT: 'About',
  IMPRINT: 'Imprint',
  CURRENT_PASSCODE: 'Current passcode',
  CREATE_NEW_PASSCODE: 'Create new passcode',
  WRONG_PASSCODE: 'Wrong passcode',
  PASSCODE_CHANGED: 'Passcode changed!',
  LOG_OUT: 'Log out',
  DE_VERSION: 'DE Version',
  PRIVACY_POLICY: 'Privacy Policy',
  TERMS_OF_SERVICE: 'Terms of Service',
  YOUR_DOCUMENTS_ARE_AT_RISK:
    'Your documents are at risk of permanent loss without a backup',
  PRIVACY_POLICY_QUESTIONS:
    'If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.',
  SELECT_AN_OPTION: 'Select an option',
  POSSIBLE_PARTNERSHIP: 'Possible partnership with Jolocom',
  ISSUES_WITH_THE_APP: 'Issues with the application',
  I_LOST_MY_WALLET: 'I lost my wallet',
  HOW_TO_BECOME_PART_OF_THE_PROJECT: 'How to become a part of the project?',
  ENGLISH: 'English',
  GERMAN: 'German',
  POPULAR_QUESTIONS: 'Popular questions',
  TAP_TO_WRITE: 'Tap to write',
  BACKUP_OPTIONS: 'Backup options',
  BACKUP_YOUR_DATA: 'Backup your data',
  RESTORE_YOUR_DATA: 'Restore your data',
  DOWNLOAD_AN_ENCRYPTED_COPY_OF_THE_DATA:
    'Download an encrypted copy of the data in your SmartWallet to your device. Make sure to keep your backups up-to-date and stored somewhere safe',
  IN_CASE_YOU_DELETED_SOMETHING_IMPORTANT:
    'In case you deleted something important by mistake. Only possible if backup was created using this wallet',
  EXPORT_BACKUP_FILE: 'Export backup file',
  IMPORT_FILE: 'Import file',
  LAST_BACKUP: 'Last backup',
  CONTACT_US_GET_IN_TOUCH: 'Write your email here...',
  EMPTY_WALLET: 'Empty wallet',
  YOUR_IDENTITY_WILL_NOT_BE_DELETED:
    'Your identity will not be deleted, but we will erase all the documents and data from your wallet',
  WHAT_WE_ARE_GOING_TO_TALK_ABOUT: 'What we are going to talk about?',
  ANYTHING_SPECIFIC_TO_MENTION: 'Anything specific to mention?',
  DARE_TO_SUGGEST_SMTH:
    'Dare to suggest you have something to tell us, so we will be prepared for the future conversations',
  WANT_TO_GET_IN_TOUCH: 'Want to get in touch?',
  WE_DO_NOT_STORE_DATA: 'We do not store data and do not spam',
  PLEASE_ENTER_A_VALID_EMAIL: 'Please enter a valid email',
  SEND: 'Send',
  CLEAR_IDENTITY_DETAILS:
    'If you want to start fresh and erase all data related to this wallet’s identity',
  CLEAR_IDENTITY_BTN: 'click here',
  CLEAR_IDENTITY_LOADER: 'Processing data removal',
  CLEAR_IDENTITY_TITLE:
    'Please pay attention that you are deleting all your data and it cannot be recovered in the future',
}

const termsConsent = {
  SMARTWALLET_INTRODUCING_TERMS_AND_CONDITIONS_AND_PRIVACY_POLICY:
    'SmartWallet introducing Terms and Conditions and Privacy Policy',
  YOU_CAN_FIND_THE_GERMAN_AND_ENGLISH_VERSION_OF_THE_DOCUMENTS_BELOW:
    'You can find the German and English version of the documents below. Please note that the German version is legally binding',
  I_UNDERSTAND_AND_ACCEPT_THE_TERMS_OF_SERVICE_AND_PRIVACY_POLICY:
    'I understand and accept the Terms of Service and Privacy Policy',
  ACCEPT_NEW_TERMS: 'Accept new terms',
}

const attributes = {
  ADD_ATTRIBUTE: 'Add new one',
  NAME: 'Name',
  EMAIL: 'Email',
  ADDRESS: 'Address',
  ADDRESS_LINE_FIELD: 'Address line',
  POSTAL_CODE_FIELD: 'Postal code',
  CITY_FIELD: 'City',
  COUNTRY_FIELD: 'Country',
  NUMBER: 'Number',
  GIVEN_NAME_FIELD: 'Given name',
  FAMILY_NAME_FIELD: 'Family name',
  COMPANY_NAME_FIELD: 'Company name',
  MISSING_INFO: 'Missing info',
  SAVE_YOUR_ATTRIBUTE: (name: string) => `Save your attribute ${name}`,
  ADD_YOUR_ATTRIBUTE: 'Add your {{attribute}}',
  EDIT_YOUR_ATTRIBUTE: 'Edit your {{attribute}}',
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

const toasts = {
  REPORT: 'Report',
  REVIEW: 'Review',
  ERROR_TOAST_TITLE: 'Whoops...',
  ERROR_TOAST_MSG:
    "We weren't expecting that to happen either. Help us help everyone by sharing the error you encountered",
  INTERACTION_SUCCESS_TOAST_TITLE: 'Great success!',
  INTERACTION_SUCCESS_TOAST_MSG:
    'Interaction with the service completed. Your service page should be updated now',
  OFFER_ALL_INVALID_TOAST_TITLE: 'Unable to save',
  OFFER_ALL_INVALID_TOAST_MSG:
    'There seems to be an issue with the documents sent by {{serviceName}}',
  OFFER_RENEGOTIATION_TITLE: 'Be aware',
  OFFER_RENEGOTIATION_MSG:
    "Some documents didn't pass our security check and cannot be saved or received",
  SHARE_MISSING_DOCS_TITLE: 'Missing documents',
  SHARE_MISSING_DOCS_MSG:
    "{{serviceName}} is requesting documents that can't be found in your wallet. \n Missing: {{documentType}}",
  WHOOPS: 'Whoops',
  COULDNOT_DEACTIVATE: 'We could not deactivate biometrics',
  COULDNOT_ACTIVATE: 'We could not activate biometrics',
  NOT_CONNECTED: "Uh...oh you're not connected",
  WE_CANT_REACH_YOU:
    "We can't reach you if you don't have internet. Please check your connection and try again",
  YOU_ARE_BACK_ONLINE: "You're back online",
  ALL_WALLET_FUNCTIONALITIES: 'All wallet functionalities are back again',
}

const documents = {
  DROP_THE_BALL: 'Drop the ball to delete',
  DO_YOU_WANT_TO_DELETE: 'Do you want to delete',
  DOCUMENT: 'Document',
  TYPE: 'Type',
  ISSUER: 'Issuer',
  TYPE_OF_DOCUMENT: 'Type of the document',
  INFO: 'Info',
  DELETE: 'Delete',
  ITS_STILL_EMPTY: 'It’s still empty',
  YOU_HAVENT_SAVED_ANY_DOCUMENTS_YET:
    "You haven't saved any documents yet. Get one today!",
  NOTHING_HERE_YET: 'Nothing here yet',
  YOU_HAVENT_SAVED_ANYTHING_YET: "You haven't saved anything yet",
  ISSUED: 'Issued',
  EXPIRES: 'Expires',
  SUBJECT_NAME: 'Subject name',
  ANONYMOUS: 'Anonymous',
  IDENTIFICATION: 'Identification',
  TICKET: 'Ticket',
  UNKNOWN: 'Unknown',
}

const history = {
  ALL: 'All',
  SHARED: 'Shared',
  RECEIVED: 'Received',
  AUTHENTICATION: 'Authentication',
  REQUESTED: 'Requested',
  CONFIRMED: 'Confirmed',
  NOT_REQUESTED: 'Not requested',
  NOT_CONFIRMED: 'Not confirmed',
  AUTHORIZATION: 'Authorization',
  AUTHORIZED: 'Authorized',
  NOT_AUTHORIZED: 'Not authorized',
  OFFERED: 'Offered',
  SELECTED: 'Selected',
  ISSUED: 'Issued',
  NOT_OFFERED: 'Not offered',
  NOT_SELECTED: 'Not selected',
  NOT_ISSUED: 'Not issued',
  NOT_SHARED: 'Not shared',
  NO_HISTORY_YET: 'No history yet',
  YOU_DONT_HAVE_ANY_COMPLETED_INTERACTIIONS_YET_MAKE_ONE_TODAY:
    'You dont have any completed interactions yet. Make one today!',
}

const identity = {
  YOUR_INFO: 'Your info',
  START_NOW: 'Start now',
  CREDENTIALS: 'Credentials',
  IT_IS_TIME_TO_CREATE: 'It’s time to create your first Digital Identity',
  INTRODUCE_YOURSELF: 'Please, introduce yourself',
  BEST_WAY_TO_CONTACT_YOU: 'Best way to contact you?',
  WHAT_COMPANY_DO_YOU_REPRESENT: 'What company do you represent?',
  NEXT: 'Next',
  WHAT_IS_YOUR_NAME: 'What is your name?',
  CREATE: 'Create',
  EDIT: 'Edit',
  CONTACT_ME: 'Contact me',
  COMPANY: 'Company',
  YOUR_NAME: 'Your name',
  NOT_SPECIFIED: 'Not specified',
  YOUR_INFO_IS_QUITE_EMPTY:
    'Your info is quite empty\nFill it in for the future cases',
}

const bottomBar = {
  IDENTITY: 'Identity',
  HISTORY: 'History',
  DOCUMENTS: 'Documents',
  SETTINGS: 'Settings',
}

const validation = {
  AT_LEAST_ONE_ERROR: 'Please provide at least one of the values',
  EMAIL_FORMAT_ERROR: 'Seems like this is not a valid email',
  VALUE_MISSING: 'Please provide value',
  SHORT: 'Too little characters',
  LARGE: 'Too many characters',
  ONLY_NUMBERS: 'Only number characters are allowed',
}

export const strings = {
  ...loaderMsgs,
  ...errors,
  ...passcode,
  ...walkthrough,
  ...entropy,
  ...recovery,
  ...seedphrase,
  ...walletAuthentication,
  ...scanner,
  ...settings,
  ...lock,
  ...interactions,
  ...attributes,
  ...recoverPin,
  ...settings,
  ...termsConsent,
  ...toasts,
  ...documents,
  ...history,
  ...identity,
  ...bottomBar,
  ...validation,
}
