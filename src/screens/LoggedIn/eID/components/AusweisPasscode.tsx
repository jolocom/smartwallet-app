import React, { useEffect, useMemo, useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { ActivityIndicator, Alert, View } from 'react-native'
import { AA2Messages, AusweisPasscodeMode, eIDScreens } from '../types'
import { aa2EmitterTemp } from '../events'
import { usePasscode } from '~/components/Passcode/context'
import { sleep } from '~/utils/generic'
import { StackActions } from '@react-navigation/routers'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import { AusweisStackParamList } from '..'
import { useAusweisInteraction } from '../hooks'
import { aa2Module } from 'react-native-aa2-sdk'
import { useToasts } from '~/hooks/toasts'
import { LOG } from '~/utils/dev'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

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
        console.log('PUK REQUEST')
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
        console.log('CAN REQUEST')
        setWaitingForMsg(false)
        setPinVariant(AusweisPasscodeMode.CAN)
      },
      handleCardInfo: (info) => {
        if (!info) {
          scheduleInfo({
            title: 'Oops!',
            message: 'You should still hold your card against the wallet!',
          })
        }
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
      return 'To allow data exchange enter you six digit eID PIN'
    } else if (pinVariant === AusweisPasscodeMode.CAN) {
      return 'Before the third attempt, please enter the six digit Card Access Number (CAN)'
    } else if (pinVariant === AusweisPasscodeMode.PUK) {
      return 'PUK'
    } else {
      return ''
    }
  }, [pinVariant])

  const handleOnSubmit = async (passcode: string) => {
    const passcodeNumber = parseInt(passcode)

    setWaitingForMsg(true)
    setErrorText(null)

    if (pinVariant === AusweisPasscodeMode.PIN) {
      passcodeCommands.setPin(passcodeNumber)
    } else if (pinVariant === AusweisPasscodeMode.CAN) {
      passcodeCommands.setCan(passcodeNumber)
    } else if (pinVariant == AusweisPasscodeMode.PUK) {
      passcodeCommands.setPuk(passcodeNumber)
    }
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.mainDark}
      customStyles={{
        justifyContent: 'flex-start',
      }}
    >
      <Passcode onSubmit={handleOnSubmit} length={6}>
        <PasscodeErrorSetter errorText={errorText} />
        <Passcode.Container customStyles={{ marginTop: 42 }}>
          <Passcode.Header title={title} errorTitle={title} />
          {pinVariant === AusweisPasscodeMode.CAN && (
            <JoloText
              customStyles={{ marginBottom: 36, paddingHorizontal: 24 }}
              color={Colors.white80}
              kind={JoloTextKind.title}
              size={JoloTextSizes.mini}
            >
              You can find it in the bottom right on the front of your physical
              ID card
            </JoloText>
          )}
          {waitingForMsg ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Passcode.Input cellColor={Colors.chisinauGrey} />
          )}
          <View style={{ position: 'relative', alignItems: 'center' }}>
            <Passcode.Error />
          </View>
        </Passcode.Container>
        <Passcode.Container customStyles={{ justifyContent: 'flex-end' }}>
          {/* <Passcode.Forgot /> */}
          <Passcode.Keyboard />
        </Passcode.Container>
      </Passcode>
    </ScreenContainer>
  )
}
