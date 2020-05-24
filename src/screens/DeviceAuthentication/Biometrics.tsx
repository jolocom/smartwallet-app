import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import TouchID from 'react-native-touch-id'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import Btn from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'

import { strings } from '~/translations/strings'
import { useDeviceAuthDispatch } from './module/context'
import { TouchableOpacity } from 'react-native'
import { Colors } from '~/utils/colors'
import { setLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import useDelay from '~/hooks/useDelay'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'

interface BiometricsPropsI {
  authType: string
}

const authConfig = {
  title: 'Authentication Required',
  fallbackLabel: '',
  passcodeFallback: false,
}

const Biometrics: React.FC<BiometricsPropsI> = ({ authType }) => {
  const [error, setError] = useState(null)

  const dispatchToLoader = useDispatch()
  const dispatch = useDeviceAuthDispatch()

  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)

  const fallbackToPasscode = () => {
    dispatch(null)
  }

  const authenticate = async () => {
    setError(null)
    try {
      const isAuthenticated = await TouchID.authenticate(
        strings.TO_PROTECT_YOUR_DATA_AND_CONFIDENTIALITY,
        authConfig,
      )

      // if biometrics from device match
      if (isAuthenticated) {
        dispatchToLoader(
          setLoader({
            type: LoaderTypes.success,
            msg: strings.SUCCESS_SETTING_UP_ADDITIONAL_PROTECTION,
          }),
        )
        await useDelay(redirectToLoggedIn)

        //TODO: store prefered DeviceAuth method somewhere.
      }
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
