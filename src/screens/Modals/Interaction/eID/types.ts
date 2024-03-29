import { EventHandlers } from '@jolocom/react-native-ausweis/js/commandTypes'

export enum eIDScreens {
  RequestDetails = 'RequestDetails',
  EnterPIN = 'EnterPIN',
  PinInfo = 'PinInfo',
  AusweisScanner = 'AusweisScanner',
  ProviderDetails = 'ProviderDetails',
  PukLock = 'PukLock',
  CompatibilityResult = 'CompatibilityResult',
  CanInfo = 'CanInfo',
  ForgotPin = 'ForgotPin',
  PukInfo = 'PukInfo',
  AusweisTransportWarning = 'AusweisTransportWarning',
  AusweisTransportPinInfo = 'AusweisTransportPinInfo',
  AusweisChangePin = 'AusweisChangePin',
}

export enum AusweisPasscodeMode {
  PIN = 'PIN',
  TRANSPORT_PIN = 'TRANSPORT_PIN',
  CAN = 'CAN',
  PUK = 'PUK',
  NEW_PIN = 'NEW_PIN',
  VERIFY_NEW_PIN = 'VERIFY_NEW_PIN',
}

export interface AusweisPasscodeParams {
  mode: AusweisPasscodeMode
  /**
   * NOTE:
   * "pinContext" indicates whether passcode screens deal with
   * normal 6-digit pin (AusweisPasscodeMode.PIN) or
   * 5-digit pin (AusweisPasscodeMode.TRANSPORT_PIN)
   */
  /**
   * TODO: pinContext prop seems to be redundant since
   * we distinguish between PIN and TRANSPORT_PIN in the flow prop
   */
  pinContext?: AusweisPasscodeMode.TRANSPORT_PIN | AusweisPasscodeMode.PIN
  handlers?: Partial<EventHandlers>
  flow: AusweisFlow
}

export enum AusweisFlow {
  auth = 'auth',
  changePin = 'changePin',
  changeTransportPin = 'changeTransportPin',
  unlock = 'unlock',
}

export enum AusweisFields {
  Address = 'Address',
  BirthName = 'BirthName',
  FamilyName = 'FamilyName',
  GivenNames = 'GivenNames',
  PlaceOfBirth = 'PlaceOfBirth',
  DateOfBirth = 'DateOfBirth',
  DoctoralDegree = 'DoctoralDegree',
  ArtisticName = 'ArtisticName',
  Pseudonym = 'Pseudonym',
  ValidUntil = 'ValidUntil',
  Nationality = 'Nationality',
  IssuingCountry = 'IssuingCountry',
  DocumentType = 'DocumentType',
  ResidencePermitI = 'ResidencePermitI',
  ResidencePermitII = 'ResidencePermitII',
  CommunityID = 'CommunityID',
  AddressVerification = 'AddressVerification',
  AgeVerification = 'AgeVerification',
  WriteAddress = 'WriteAddress',
  WriteCommunityID = 'WriteCommunityID',
  WriteResidencePermitI = 'WriteResidencePermitI',
  WriteResidencePermitII = 'WriteResidencePermitII',
  CanAllowed = 'CanAllowed',
  PinManagement = 'PinManagement',
}

export interface IAusweisRequest {
  requiredFields: Array<AusweisFields>
  optionalFields: Array<AusweisFields>
  certificateIssuerName: string
  certificateIssuerUrl: string
  providerName: string
  providerUrl: string
  providerInfo: string
  effectiveValidityDate: string
  expirationDate: string
}

export enum CardInfoMode {
  notBlocked = 'notBlocked',
  blocked = 'blocked',
  unblocked = 'unblocked',
  standaloneUnblock = 'standaloneUnblock',
}

export type AusweisCardInfoParams = {
  mode: CardInfoMode
  onDismiss?: () => void
}

export type AusweisContextValue = IAusweisRequest & {
  setRequest: (data: IAusweisRequest) => void
  resetRequest: () => void
}

export enum AusweisScannerState {
  idle = 'idle',
  loading = 'loading',
  success = 'success',
  failure = 'failure',
}

export interface AusweisScannerParams {
  onDone?: () => void
  onDismiss?: () => void
  state?: AusweisScannerState
}

export interface AusweisCardResult {
  inoperative: boolean
  deactivated: boolean
}
