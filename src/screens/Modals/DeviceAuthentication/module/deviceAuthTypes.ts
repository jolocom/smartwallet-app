export enum DeviceAuthActions {
  setBiometryType,
  showBiometry,
}

export enum BiometryTypes {
  TouchID = 'Touch ID',
  FaceID = 'Face ID',
  Biometrics = 'Biometrics',
}

export interface StateI {
  biometryType: BiometryTypes
  isPasscodeView: boolean
}

export interface ActionI {
  type: DeviceAuthActions
  payload?: any
}
