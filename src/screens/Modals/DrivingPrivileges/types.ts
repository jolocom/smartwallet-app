import { VehicleClasses } from 'react-native-mdl'

export enum MdlCredential {
  type = 'DrivingLicenseCredential',
}
export interface PrivilegesData {
  title: string
  data: [
    { vehicle_category_code: VehicleClasses; title: string },
    { issue_date: string; title: string },
    {
      codes?: Array<{
        code: string
      }>
      title: string
    },
    { expiry_date?: string; title: string },
  ]
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

export interface DrivingPrivilegesProps {
  title: string
  portrait: string
  issuerIcon: string
  prefechedIcon: string
  document: Document
  containerHeight: () => void
  handleLayout: () => void
  imageSize: number
}
