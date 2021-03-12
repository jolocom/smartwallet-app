import React, { useEffect, useState } from 'react'
import Keychain from 'react-native-keychain'
import { NavigationProp } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'

import { strings } from '~/translations/strings'
import { PIN_SERVICE, PIN_USERNAME } from '~/utils/keychainConsts'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'
import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { ScreenNames } from '~/types/screens'
import { useRedirectTo } from '~/hooks/navigation'
import Passcode from '~/components/Passcode'

interface PropsI {
  onSuccessRedirectToScreen?: ScreenNames
  navigation: NavigationProp<{}>
}

const ChangePin: React.FC<PropsI> = ({
  onSuccessRedirectToScreen,
  navigation,
}) => {
  const [isCreateNew, setIsCreateNew] = useState(false)
  const [headerTitle, setHeaderTitle] = useState(strings.CURRENT_PASSCODE)
  const [pinMatch, setPinMatch] = useState(false)

  const { keychainPin } = useGetStoredAuthValues()
  const dispatch = useDispatch()

  const verifyPin = async (pin: string) => {
    if (pin === keychainPin) {
      setPinMatch(true)
    } else {
      throw new Error("Pins don't match")
    }
  }

  // this effect is for letting user see success status of the input
  useEffect(() => {
    let id: NodeJS.Timeout
    if (pinMatch) {
      id = setTimeout(() => {
        setIsCreateNew(true)
        setHeaderTitle(strings.CREATE_NEW_PASSCODE)
      }, 500)
    }
    return () => {
      clearTimeout(id)
    }
  }, [pinMatch])

  const updatePin = async (pin: string) => {
    try {
      await Keychain.setGenericPassword(PIN_USERNAME, pin, {
        service: PIN_SERVICE,
        storage: Keychain.STORAGE_TYPE.AES,
      })
      dispatch(
        setLoader({
          type: LoaderTypes.success,
          msg: strings.PASSWORD_SUCCESSFULLY_CHANGED,
        }),
      )
      setTimeout(() => {
        dispatch(dismissLoader())
        if (onSuccessRedirectToScreen) {
          const redirectToScreen = useRedirectTo(onSuccessRedirectToScreen)
          redirectToScreen()
        } else {
          navigation.goBack()
        }
      }, 2500)
    } catch (e) {
      console.warn('Error occured setting new pin', { e })
    }
  }

  return (
    <ScreenContainer
      customStyles={{
        marginTop: '15%',
        justifyContent: 'flex-start',
        paddingTop: 0,
      }}
      hasHeaderBack
    >
      <Passcode onSubmit={isCreateNew ? updatePin : verifyPin}>
        <Passcode.Header
          title={headerTitle}
          errorTitle={isCreateNew ? strings.WHOOPS : strings.WRONG_PASSCODE}
        />
        <Passcode.Input />
        <Passcode.Forgot />
      </Passcode>
    </ScreenContainer>
  )
}

export default ChangePin
