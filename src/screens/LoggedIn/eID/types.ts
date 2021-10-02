export enum AusweisFields {
  Address = 'Address',
  BirthName = 'BirthName',
  FamilyName = 'FamilyName',
  GivenNames = ' GivenNames',
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

export interface AusweisRequest {
  requiredFields: Array<AusweisFields>
  optionalFields: Array<AusweisFields>
  certificateIssuerName: string
  certificateIssuerUrl: string
  providerName: string
  providerUrl: string
  effectiveValidityDate: string
  expirationDate: string
}

export type AusweisContextValue = AusweisRequest & {
  setRequest: (data: AusweisRequest) => void
  resetRequest: () => void
}
