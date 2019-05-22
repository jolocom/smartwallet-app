// NOTE: don't use 'const' so that values are useable in both .js and .ts files
export enum routeList {
  Landing = 'Landing',
  Loading = 'Loading',
  SeedPhrase = 'SeedPhrase',

  Home = 'Home',
  Identity = 'Identity',
  Claims = 'Claims',
  Interactions = 'Interactions',
  Documents = 'Documents',
  Records = 'Records',
  Settings = 'Settings',
  QRCodeScanner = 'QRCodeScanner',

  CredentialDialog = 'CredentialDialog',
  Consent = 'Consent',
  PaymentConsent = 'PaymentConsent',
  AuthenticationConsent = 'AuthenticationConsent',
  ClaimDetails = 'ClaimDetails',

  Exception = 'Exception',
}
