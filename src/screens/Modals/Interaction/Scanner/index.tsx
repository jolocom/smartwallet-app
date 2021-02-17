import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import useCameraPermissions, {
  Results,
} from '~/screens/Modals/Interaction/Scanner/useCameraPermissions'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'
import Camera from '~/screens/Modals/Interaction/Scanner/Camera'
import ScreenHeader from '~/components/ScreenHeader'

const Scanner: React.FC = () => {
  const { permission, handlePlatformPermissions } = useCameraPermissions()

  return permission === Results.GRANTED ? (
    <Camera />
  ) : (
    <ScreenContainer hasHeaderClose>
      <ScreenHeader
        title={strings.CAMERA_PERMISSION}
        subtitle={strings.YOU_CANT_SCAN_WITHOUT_MAIN_FUNCTION}
      />
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

export default Scanner
