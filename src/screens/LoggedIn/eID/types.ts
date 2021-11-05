import { EventHandlers } from 'react-native-aa2-sdk/js/commandTypes'

export enum eIDScreens {
  InteractionSheet = 'InteractionSheet',
  ReadinessCheck = 'ReadinessCheck',
  RequestDetails = 'RequestDetails',
  EnterPIN = 'EnterPIN',
  PasscodeDetails = 'PasscodeDetails',
  AusweisScanner = 'AusweisScanner',
  ProviderDetails = 'ProviderDetails',
  PukLock = 'PukLock',
  CompatibilityResult = 'CompatibilityResult',
  CanInfo = 'CanInfo',
  PukInfo = 'PukInfo',
}

export enum AA2Messages {
  EnterPin = 'ENTER_PIN',
  EnterCan = 'ENTER_CAN',
  EnterPuk = 'ENTER_PUK',
  SetPin = 'SET_PIN',
  Reader = 'READER',
}

export enum AusweisPasscodeMode {
  PIN = 'PIN',
  CAN = 'CAN',
  PUK = 'PUK',
  NEW_PIN = 'NEW_PIN',
  VERIFY_NEW_PIN = 'VERIFY_NEW_PIN',
}

export interface AusweisPasscodeProps {
  mode: AusweisPasscodeMode
  handlers?: Partial<EventHandlers>
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
