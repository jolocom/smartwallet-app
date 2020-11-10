export enum DeviceAuthActions {
  setBiometryType,
  showBiometry,
}

export enum BiometryTypes {
  TouchID = 'Touch ID',
  FaceID = 'Face ID',
  Biometrics = 'Biometrics',
  Fingerprint = 'Fingerprint',
  FACE = 'FACE',
}

export interface StateI {
  biometryType: BiometryTypes
  isPasscodeView: boolean
}

export interface ActionI {
  type: DeviceAuthActions
  payload?: any
}
