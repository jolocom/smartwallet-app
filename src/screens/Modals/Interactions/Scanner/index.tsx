import React from 'react'
import { StyleSheet } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import useCameraPermissions, {
  Results,
} from '~/screens/Modals/Interactions/Scanner/useCameraPermissions'
import Paragraph from '~/components/Paragraph'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'
import Camera from '~/screens/Modals/Interactions/Scanner/Camera'

const Scanner: React.FC = () => {
  const { permission, handlePlatformPermissions } = useCameraPermissions()

  return permission === Results.GRANTED ? (
    <Camera />
  ) : (
    <ScreenContainer hasHeaderClose>
      <Header customStyles={styles.permissionText}>
        {strings.CAMERA_PERMISSION}
      </Header>
      <Paragraph
        customStyles={{
          ...styles.permissionParagraph,
          ...styles.permissionText,
        }}
      >
        {strings.YOU_CANT_SCAN_WITHOUT_MAIN_FUNCTION}
      </Paragraph>
      <Btn
        type={BtnTypes.secondary}
        customTextStyles={{ color: Colors.activity }}
        onPress={handlePlatformPermissions}
      >
        {strings.TAP_TO_ACTIVATE_CAMERA}
      </Btn>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  permissionParagraph: {
    paddingVertical: 18,
  },
  permissionText: {
    color: Colors.white85,
  },
})

export default Scanner
