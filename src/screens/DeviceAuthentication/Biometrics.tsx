import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import Btn, { BtnTypes } from '~/components/Btn'

import { strings } from '~/translations/strings'
import { useDeviceAuthDispatch } from './module/context'

interface BiometricsPropsI {
  authType: string
}

const Biometrics: React.FC<BiometricsPropsI> = ({ authType }) => {
  const dispatch = useDeviceAuthDispatch()
  const fallbackToPasscode = () => {
    dispatch(null)
  }

  return (
    <ScreenContainer customStyles={{ justifyContent: 'space-between' }}>
      <Header>{strings.USE_ID_TO_AUTHORIZE(authType)}</Header>
      <Paragraph>{strings.SO_YOU_DONT_NEED_TO_CONFIRM}</Paragraph>
      <Paragraph>{strings.TAP_TO_ACTIVATE(authType)}</Paragraph>
      <Btn type={BtnTypes.secondary} onPress={fallbackToPasscode}>
        {strings.SKIP}
      </Btn>
    </ScreenContainer>
  )
}

export default Biometrics
