import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { aa2Module } from 'react-native-aa2-sdk'
import { ActivityIndicator, Platform, View } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/core'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { usePasscode } from '~/components/Passcode/context'
import { useToasts } from '~/hooks/toasts'
import { setPopup } from '~/modules/appState/actions'
import { AusweisStackParamList } from '..'
import { useAusweisInteraction } from '../hooks'
import { AusweisPasscodeMode, eIDScreens } from '../types'

const ALL_EID_PIN_ATTEMPTS = 3

interface PasscodeErrorSetterProps {
  errorText: string | null
}
/**
 * NOTE:
 * this component can only be used inside Passcode context
 */
const PasscodeErrorSetter: React.FC<PasscodeErrorSetterProps> = ({
  errorText,
}) => {
  const { setPinError, setPinErrorText } = usePasscode()

  useEffect(() => {
    if (Boolean(errorText)) {
      setPinError(true)
      setPinErrorText(errorText)
    }
  }, [errorText])

  return null
}

/**
 * QUESTION:
 * How do we handle error in send cmds (results in error prop on ENTER_PIN msg)
 */
export const AusweisPasscode = () => {
  const { mode } =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.EnterPIN>>().params

  const { scheduleInfo } = useToasts()
  const { passcodeCommands, cancelFlow, finishFlow } = useAusweisInteraction()
  const dispatch = useDispatch()

  const [pinVariant, setPinVariant] = useState(mode)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [waitingForMsg, setWaitingForMsg] = useState(false)

  useEffect(() => {
    aa2Module.setHandlers({
      handleCardRequest: () => {
        // TODO remove toast?
      },
      handlePinRequest: (card) => {
        setWaitingForMsg(false)
        setPinVariant(AusweisPasscodeMode.PIN)

        const errorText = `Wrong PIN, you used ${
          ALL_EID_PIN_ATTEMPTS - card.retryCounter
        }/${ALL_EID_PIN_ATTEMPTS} attempts`

        if (card.retryCounter !== ALL_EID_PIN_ATTEMPTS) {
          setErrorText(errorText)
        }
      },
      handlePukRequest: (card) => {
        setWaitingForMsg(false)
        setPinVariant(AusweisPasscodeMode.PUK)
        if (card.inoperative) {
          scheduleInfo({
            title: 'Oops!',
            message: "Seems like you're locked out of your card",
          })
          cancelFlow()
        }
      },
      handleCanRequest: (card) => {
        setWaitingForMsg(false)
        setPinVariant(AusweisPasscodeMode.CAN)
      },
      handleAuthResult: (url) => {
        finishFlow(url)
      },
    })

    return () => {
      aa2Module.resetHandlers()
    }
  }, [])

  const title = useMemo(() => {
    if (pinVariant === AusweisPasscodeMode.PIN) {
      return 'PIN'
    } else if (pinVariant === AusweisPasscodeMode.CAN) {
      return 'CAN'
    } else if (pinVariant === AusweisPasscodeMode.PUK) {
      return 'PUK'
    } else {
      return ''
    }
  }, [pinVariant])

  const handleOnSubmit = async (passcode: string) => {
    setWaitingForMsg(true)
    setErrorText(null)

    /**
     * NOTE: the popup on iOS will bring the app
     * to the "inactive" state;
     */
    if (Platform.OS === 'ios') {
      dispatch(setPopup(true))
    }

    if (pinVariant === AusweisPasscodeMode.PIN) {
      passcodeCommands.setPin(passcode)
    } else if (pinVariant === AusweisPasscodeMode.CAN) {
      passcodeCommands.setCan(passcode)
    } else if (pinVariant == AusweisPasscodeMode.PUK) {
      passcodeCommands.setPuk(passcode)
    }
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
      }}
    >
      <Passcode onSubmit={handleOnSubmit} length={6}>
        <PasscodeErrorSetter errorText={errorText} />
        <Passcode.Container>
          <Passcode.Header title={title} errorTitle={title} />
          {waitingForMsg ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Passcode.Input />
          )}
          <View style={{ position: 'relative', alignItems: 'center' }}>
            <Passcode.Error />
          </View>
        </Passcode.Container>
        <Passcode.Container>
          <Passcode.Forgot />
          <Passcode.Keyboard />
        </Passcode.Container>
      </Passcode>
    </ScreenContainer>
  )
}
