export enum DeviceAuthActions {
  setBiometryType = 'setBiometryType',
  showBiometry = 'showBiometry',
}

export enum BiometryTypes {
  TouchID = 'TouchID',
  FaceID = 'FaceID',
  Biometrics = 'Biometrics',
  Face = 'FACE',
}

export interface StateI {
  biometryType: BiometryTypes | undefined
  isPasscodeView: boolean
}

export interface ActionI {
  type: DeviceAuthActions
  payload?: any
}
