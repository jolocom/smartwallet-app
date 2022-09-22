import { DrivingPrivilege } from 'react-native-mdl'

export enum MdlCredential {
  type = 'DrivingLicenseCredential',
}
export interface PrivilegesData {
  title: string
  data: DrivingPrivilege
}

export enum MdlPropertyKeys {
  givenName = '$.given_name',
  familyName = '$.family_name',
  birthDate = '$.birth_date',
  documentNumber = '$.document_number',
  issueDate = '$.issue_date',
  issuingCountry = '$.issuing_country',
  unDistinguishingSign = '$.un_distinguishing_sign',
  drivingPrivileges = '$.driving_privileges',
  portrait = '$.portrait',
}
