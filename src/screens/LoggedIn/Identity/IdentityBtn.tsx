import React from 'react'
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
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
      <View
        style={{
          ...styles.activityIndicatorContainer,
          display: loading ? 'flex' : 'none',
          zIndex: loading ? 100 : 0,
        }}
      >
        <ActivityIndicator color={Colors.white80} animating={loading} />
      </View>
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
  activityIndicatorContainer: {
    alignItems: 'center',
    backgroundColor: Colors.mainDark,
    borderRadius: 12,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    alignItems: 'flex-start',
    backgroundColor: Colors.white08,
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
