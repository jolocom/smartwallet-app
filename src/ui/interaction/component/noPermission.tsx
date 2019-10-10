import React, { FC } from 'react'
import { PlatformOSType, StyleSheet, Text, View } from 'react-native'
import I18n from '../../../locales/i18n'
import strings from '../../../locales/strings'
import { Colors, Spacing } from '../../../styles'
import { centeredText, fontMain, textSM, textXL, textXS } from '../../../styles/typography'

const styles = StyleSheet.create({
  notAuthorizedOverlay: {
    flex: 1,
    backgroundColor: Colors.black065,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
    justifyContent: 'center',
  },
  scanText: {
    color: Colors.sandLight,
    fontSize: textXL,
    fontFamily: fontMain,
    ...centeredText,
  },
  notAuthorizedDescription: {
    color: Colors.sandLight080,
    fontSize: textSM,
    paddingTop: Spacing.XS,
    paddingHorizontal: Spacing.XXL,
    marginBottom: Spacing.XXL,
    fontFamily: fontMain,
    lineHeight: 24,
    ...centeredText,
  },
  androidPermissionButton: {
    color: Colors.white,
    fontSize: textXS,
    textDecorationLine: 'underline',
    fontFamily: fontMain,
    lineHeight: 20,
    ...centeredText,
  },
  iosPermissionButton: {
    color: Colors.nativeBlue,
    fontSize: textXS,
    fontFamily: fontMain,
    lineHeight: 20,
    ...centeredText,
  },
})

interface Props {
  onPressEnable: () => void
  platform: PlatformOSType
}

export const NoPermissionComponent: FC<Props> = (props: Props) => {
  return(
    <React.Fragment>
      <View style={styles.notAuthorizedOverlay}>
        <Text style={styles.scanText}>{I18n.t(strings.SCAN_QR)}</Text>
        <Text style={styles.notAuthorizedDescription}>
          {I18n.t(
            strings.ENABLE_ACCESS_SO_YOU_CAN_START_TAKING_PHOTOS_AND_VIDEOS,
          )}
        </Text>
        <Text
          style={
            props.platform === 'ios' ? styles.iosPermissionButton : styles.androidPermissionButton
          }
          onPress={props.onPressEnable}
        >
          {I18n.t(strings.ENABLE_CAMERA_ACCESS)}
        </Text>
      </View>
      <View style={styles.notAuthorizedOverlay} />
    </React.Fragment>
  )
}
