import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import useCameraPermissions, {
  Results,
} from '~/screens/Modals/Interaction/Scanner/useCameraPermissions'
import { Colors } from '~/utils/colors'
import Camera from '~/screens/Modals/Interaction/Scanner/Camera'
import ScreenHeader from '~/components/ScreenHeader'
import useTranslation from '~/hooks/useTranslation'

const Scanner: React.FC = () => {
  const { t } = useTranslation()
  const { permission, handlePlatformPermissions } = useCameraPermissions()

  return permission === Results.GRANTED ? (
    <Camera />
  ) : (
    <ScreenContainer hasHeaderClose>
      <ScreenHeader
        title={t('CameraPermission.header')}
        subtitle={t('CameraPermission.subheader')}
      />
      <Btn
        type={BtnTypes.secondary}
        customTextStyles={{ color: Colors.activity }}
        onPress={handlePlatformPermissions}
      >
        {t('CameraPermission.confirmBtn')}
      </Btn>
    </ScreenContainer>
  )
}

export default Scanner
