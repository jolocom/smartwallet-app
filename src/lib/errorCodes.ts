enum ErrorCode {
  Unknown = 'Unknown',

  // actions/account/index
  WalletInitFailed = 'WalletInit',
  SaveClaimFailed = 'SaveClaim',
  SaveExternalCredentialFailed = 'SaveExtCred',

  // actions/sso/authenticationRequest
  AuthenticationRequestFailed = 'AuthRequest',
  AuthenticationResponseFailed = 'AuthResponse',

  // actions/sso/paymentRequest
  PaymentRequestFailed = 'PayRequest',
  PaymentResponseFailed = 'PayResponse',

  // actions/sso/index
  CredentialOfferFailed = 'CredOffer',
  CredentialsReceiveFailed = 'CredsReceive',
  CredentialRequestFailed = 'CredRequest',
  CredentialResponseFailed = 'CredResponse',
  ParseJWTFailed = 'ParseJWT',

  // actions/registration
  RegistrationFailed = 'Registration',
}

export default ErrorCode
