// NOTE: don't use 'const' so that values are useable in both .js and .ts files
export enum routeList {
  AppInit = 'AppInit',

  Landing = 'Landing',
  Entropy = 'Entropy',
  RegistrationProgress = 'RegistrationProgress',
  Loading = 'Loading',

  Home = 'Home',
  Claims = 'Claims',
  Documents = 'Documents',
  Records = 'Records',
  Settings = 'Settings',
  QRCodeScanner = 'QRCodeScanner',

  CredentialDialog = 'CredentialDialog',
  Consent = 'Consent',
  PaymentConsent = 'PaymentConsent',
  AuthenticationConsent = 'AuthenticationConsent',
  ClaimDetails = 'ClaimDetails',
  DocumentDetails = 'DocumentDetails',

  SeedPhrase = 'SeedPhrase',
  RepeatSeedPhrase = 'RepeatSeedPhrase',
  SocialRecovery = 'SocialRecovery',
  ReceivedShards = 'ReceivedShards',
  AcceptShard = 'AcceptShard',

  Exception = 'Exception',
}
