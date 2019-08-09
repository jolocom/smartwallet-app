import { Colors, Typography, Spacing } from '.'

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
  // this is a hack, used because the lineHeight of our font causes it to be not
  // centered vertically within the button
  paddingVertical: Spacing.MD,
}

export const buttonDisabledStandardContainer = {
  ...buttonStandardContainer,
  backgroundColor: Colors.disabledButtonBackground,
}

export const buttonDisabledStandardText = {
  ...buttonStandardText,
  color: Colors.disabledButtonText,
}
