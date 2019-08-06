import { Colors, Typography } from '.'

export const buttonStandardContainer = {
  minWidth: 164,
  height: 48,
  borderRadius: 4,
  backgroundColor: Colors.purpleMain,
}

export const buttonStandardText = {
  ...Typography.standardText,
  // React Material Button uses a default weight, 500, that isn't supported by
  // our font on Android, so we must manually define it here
  // 2019-08-07: currently different fontWeights have no effect
  fontWeight: 'normal' as 'normal',
  color: Colors.white,
  paddingVertical: 15,
}

export const buttonDisabledStandardContainer = {
  ...buttonStandardContainer,
  backgroundColor: Colors.disabledButtonBackground,
}

export const buttonDisabledStandardText = {
  ...buttonStandardText,
  color: Colors.disabledButtonText,
}
