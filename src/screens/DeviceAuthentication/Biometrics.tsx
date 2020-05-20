import React, { useState } from 'react'
import TouchID from 'react-native-touch-id'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import Btn, { BtnTypes } from '~/components/Btn'

import { strings } from '~/translations/strings'
import { useDeviceAuthDispatch } from './module/context'
import { TouchableOpacity } from 'react-native'
import BtnGroup from '~/components/BtnGroup'
import { Colors } from '~/utils/colors'

interface BiometricsPropsI {
  authType: string
}

const Biometrics: React.FC<BiometricsPropsI> = ({ authType }) => {
  const [error, setError] = useState(null)
  const dispatch = useDeviceAuthDispatch()
  const fallbackToPasscode = () => {
    dispatch(null)
  }

  const authenticate = async () => {
    setError(null)
    try {
      const isAuthenticated = await TouchID.authenticate('hellou')
      console.log({ isAuthenticated })
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <Header>{strings.USE_ID_TO_AUTHORIZE(authType)}</Header>
      <Paragraph>{strings.SO_YOU_DONT_NEED_TO_CONFIRM}</Paragraph>
      <TouchableOpacity onPress={authenticate}>
        <Paragraph color={Colors.success}>
          {strings.TAP_TO_ACTIVATE(authType)}
        </Paragraph>
      </TouchableOpacity>
      {error && <Paragraph color={Colors.error}>{error}</Paragraph>}
      <BtnGroup>
        <Btn onPress={fallbackToPasscode}>{strings.I_WILL_RATHER_SET_PIN}</Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}

export default Biometrics
