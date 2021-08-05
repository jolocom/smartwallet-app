import { StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

export const commonStyles = StyleSheet.create({
  fieldLabelSmall: {
    fontSize: 14,
    color: Colors.slateGray,
  },
  fieldLabel: {
    fontSize: 16,
    lineHeight: 16,
    color: Colors.slateGray,
  },
  regularText: {
    fontFamily: Fonts.Regular,
    color: Colors.black,
  },
  mediumText: {
    fontFamily: Fonts.Medium,
    color: Colors.black,
  },
})
