export enum ScreenNames {
  // Logged Out Screens
  LoggedOut = 'LoggedOut',
  Onboarding = 'Onboarding',
  IdentityRecovery = 'IdentityRecovery',
  Registration = 'Registration',
  Walkthrough = 'Walkthrough',
  Idle = 'Idle',
  LostSeedPhraseInfo = 'LostSeedPhraseInfo',
  SeedPhraseWrite = 'SeedPhraseWrite',
  SeedPhraseInfo = 'SeedPhraseInfo',
  SeedPhraseRepeat = 'SeedPhraseRepeat',

  PasscodeRecovery = 'PasscodeRecovery',

  // Driving License
  DrivingLicenseForm = 'DrivingLicenseForm',
  DrivingLicenseShare = 'DrivingLicenseShare',

  // Logged In
  LoggedIn = 'LoggedIn',
  LockStack = 'LockStack',
  Lock = 'Lock',
  WalletAuthentication = 'WalletAuthentication',

  // Main
  Main = 'Main',
  MainTabs = 'MainTabs',
  Identity = 'Identity',
  Documents = 'Documents',
  History = 'History',
  Settings = 'Settings',
  // Device Authentication
  CreateWalletPin = 'CreateWalletPin',
  WalletBiometry = 'WalletBiometry',
  // Interactions
  Interaction = 'Interaction', // root screen
  Scanner = 'Scanner',
  InteractionFlow = 'InteractionFlow',
  InteractionRedirect = 'InteractionRedirect',
  // eId
  eId = 'eID',
  AusweisChangePin = 'AusweisChangePin',
  AusweisCardInfo = 'AusweisCardInfo',
  ServiceRedirect = 'ServiceRedirect',
  AusweisMoreInfo = 'AusweisMoreInfo',
  // Modals
  Loader = 'Loader',
  CredentialForm = 'CredentialForm',
  FieldDetails = 'FieldDetails',
  PopupMenu = 'PopupMenu',
  TransparentModals = 'TransparentModals',
  AppDisabled = 'AppDisabled',
  PinRecoveryInstructions = 'PinRecoveryInstructions',
  DragToConfirm = 'DragToConfirm',
  DrivingPrivileges = 'DrivingPrivileges',
  //Settings
  SettingsGeneral = 'SettingsGeneral',
  Language = 'Language',
  MnemonicPhrase = 'MnemonicPhrase',
  ChangePin = 'ChangePin',
  BackupIdentity = 'BackupIdentity',
  FAQ = 'FAQ',
  ContactUs = 'ContactUs',
  RateUs = 'RateUs',
  About = 'About',
  Imprint = 'Imprint',
  TermsOfService = 'TermsOfService',
  PrivacyPolicy = 'PrivacyPolicy',

  //Development
  CardsTest = 'CardsTest',
  ButtonsTest = 'ButtonsTest',
  LoaderTest = 'LoaderTest',
  NotificationsTest = 'NotificationsTest',
  InputTest = 'InputTest',
  PasscodeTest = 'PasscodeTest',
  CollapsibleTest = 'CollapsibleTest',
  InteractionPasteTest = 'InteractionPasteTest',
  CardStack = 'CardStack',

  //Global Screens
  GlobalModals = 'GlobalModals',
  TermsConsentStack = 'TermsConsentStack',
  TermsConsent = 'TermsConsent',
  ConsentTermsOfService = 'ConsentTermsOfService',
  ConsentPrivacyPolicy = 'ConsentPrivacyPolicy',
}
