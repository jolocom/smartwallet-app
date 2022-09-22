export interface DrivingPrivilegesData {
  title: VehicleTypes
  [SinglePrivilegesFieldKeys.VehicleCode]: string[]
  [SinglePrivilegesFieldKeys.Restrictions]: string
  [SinglePrivilegesFieldKeys.ExpiryDate]: string
  [SinglePrivilegesFieldKeys.IssueDate]: string
}

export enum MdlCredential {
  type = 'DrivingLicenseCredential',
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

export enum DrivingPrivilegesKeys {
  issueDate = 'issue_date',
  vehicleCaegroyCode = 'vehicle_category_code',
}

export enum SinglePrivilegesFieldKeys {
  Title = 'title',
  VehicleCode = 'Vehicle Code',
  IssueDate = 'Issue Date',
  Restrictions = 'Restrictions',
  ExpiryDate = 'Expiry Date',
}
export interface SinglePrivilegesField {
  [SinglePrivilegesFieldKeys.Title]: string
  [SinglePrivilegesFieldKeys.VehicleCode]: string
  [SinglePrivilegesFieldKeys.IssueDate]: string
  [SinglePrivilegesFieldKeys.Restrictions]: string
  [SinglePrivilegesFieldKeys.ExpiryDate]: string
}

export enum VehicleTypes {
  MopedAndMotorcycle = 'Moped and Motorcycle',
  PassengerCar = 'Passenger Car',
  TractorAndForklift = 'Tractor and Forklift',
  Truck = 'Truck',
  Bus = 'Bus',
}

export enum VehicleClasses {
  A = 'A',
  A1 = 'A1',
  A2 = 'A2',
  AM = 'AM',
  B96 = 'B96',
  B = 'B',
  BE = 'BE',
  C = 'C',
  C1 = 'C1',
  C1E = 'C1E',
  CE = 'CE',
  D = 'D',
  D1 = 'D1',
  D1E = 'D1E',
  DE = 'DE',
  L = 'L',
  T = 'T',
}

export interface MotorcycleClass {
  title: VehicleTypes.MopedAndMotorcycle
  classes: ['AM', 'A1', 'A2', 'A']
  data: DrivingPrivilegesData
}
export interface PassengerCarClass {
  title: VehicleTypes.PassengerCar
  classes: ['B', 'BF17', 'B96', 'BE']
  data: DrivingPrivilegesData
}
export interface TruckClass {
  title: VehicleTypes.Truck
  classes: ['C1', 'C1E', 'C', 'CE']
  data: DrivingPrivilegesData
}
export interface BusClass {
  title: VehicleTypes.Bus
  classes: ['D1', 'D1E', 'D', 'DE']
  data: DrivingPrivilegesData
}
export interface TractorClass {
  title: VehicleTypes.TractorAndForklift
  classes: ['T', 'L']
  data: DrivingPrivilegesData
}
