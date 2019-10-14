import React, { FC } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import I18n from '../../../locales/i18n'
import strings from '../../../locales/strings'
import { Colors, Spacing } from '../../../styles'
import {
  centeredText,
  fontMain,
  textSM,
  textXL,
  textXS,
} from '../../../styles/typography'

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
  enableButtonText: {
    fontSize: textXS,
    fontFamily: fontMain,
    lineHeight: 20,
    color: Platform.select({
      android: Colors.white,
      ios: Colors.nativeIosBlue,
    }),
    textDecorationLine: Platform.select({
      android: 'underline',
      ios: 'none',
    }),
    ...centeredText,
  },
  enableButtonWrapper: {
    padding: 10,
  },
})

interface Props {
  onPressEnable: () => void
}

export const NoPermissionComponent: FC<Props> = (props: Props) => {
  return (
    <React.Fragment>
      <View style={styles.notAuthorizedOverlay}>
        <Text style={styles.scanText}>{I18n.t(strings.SCAN_QR)}</Text>
        <Text style={styles.notAuthorizedDescription}>
          {I18n.t(
            strings.ENABLE_ACCESS_SO_YOU_CAN_START_TAKING_PHOTOS_AND_VIDEOS,
          )}
        </Text>
        <TouchableOpacity
          style={styles.enableButtonWrapper}
          onPress={props.onPressEnable}
        >
          <Text style={styles.enableButtonText}>
            {I18n.t(strings.ENABLE_CAMERA_ACCESS)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.notAuthorizedOverlay} />
    </React.Fragment>
  )
}
