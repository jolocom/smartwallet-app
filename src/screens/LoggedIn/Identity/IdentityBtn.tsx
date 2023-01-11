import React from 'react'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import JoloText from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { Fonts, JoloTextSizes } from '~/utils/fonts'

interface IdentityBtnProps {
  title: string
  subtitle: string
  onPress: () => void
  loading?: boolean
}

export const IdentityBtn: React.FC<IdentityBtnProps> = ({
  title,
  subtitle,
  onPress,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading}
    >
      <JoloText color={Colors.white} size={JoloTextSizes.middle}>
        {title}
      </JoloText>
      <JoloText
        color={Colors.white70}
        size={JoloTextSizes.mini}
        customStyles={styles.subtitle}
      >
        {subtitle}
      </JoloText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: Colors.mainDark,
    borderRadius: 12,
    fontFamily: Fonts.Regular,
    justifyContent: 'flex-start',
    marginVertical: 5,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  subtitle: {
    textAlign: 'left',
    ...Platform.select({
      android: {
        marginTop: 6,
      },
    }),
  },
})
