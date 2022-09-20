export interface DrivingPrivilegesData {
  vehicleCode: string[]
  restrictions: string
  expiryDate: string
  issueDate: string
}

export interface Category {
  title: VehicleTypes
  classes: string[]
  data: DrivingPrivilegesData
}

export enum DrivingPrivilegesKeys {
  VehicleCode = 'vehicleCode',
  IssueDate = 'issueDate',
  Restrictions = 'restrictions',
  ExpiryDate = 'expiryDate',
}

export enum VehicleTypes {
  MopedAndMotorcycle = 'Moped and Motorcycle',
  PassengerCar = 'Passenger Car',
  TractorAndForklift = 'Tractor and Forklift',
  Truck = 'Truck',
  Bus = 'Bus',
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
