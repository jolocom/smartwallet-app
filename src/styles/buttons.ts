import { Colors, Typography } from '.'

export const buttonStandardContainer = {
  minWidth: 164,
  height: 48,
  borderRadius: 4,
  backgroundColor: Colors.purpleMain,
}

export const buttonStandardText = {
  ...Typography.standardText,
  color: Colors.white,
  paddingVertical: 15,
}
