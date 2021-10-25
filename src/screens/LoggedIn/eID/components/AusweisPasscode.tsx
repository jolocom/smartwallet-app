import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { RouteProp, useRoute } from '@react-navigation/core'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { usePasscode } from '~/components/Passcode/context'
import JoloText, { JoloTextKind } from '~/components/JoloText'

import { useToasts } from '~/hooks/toasts'
import { useFailed, useSuccess } from '~/hooks/loader'
import { useGoBack } from '~/hooks/navigation'

import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

import { AusweisPasscodeMode, eIDScreens } from '../types'
import { useAusweisInteraction } from '../hooks'
import { AusweisStackParamList } from '..'

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
export const AusweisPasscode = ({ navigation }) => {
  const { mode } =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.EnterPIN>>().params

  const { scheduleInfo } = useToasts()
  const { passcodeCommands, cancelFlow, finishFlow } = useAusweisInteraction()
  const showSuccess = useSuccess()
  const showFailed = useFailed()
  const goBack = useGoBack()

  const [pinVariant, setPinVariant] = useState(mode)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [waitingForMsg, setWaitingForMsg] = useState(false)
  const [newPin, setPin] = useState('')

  useEffect(() => {
    //TODO: add handleBadState handler?
    aa2Module.setHandlers({
      /**
       * ENTER_PIN
       */
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
      /**
       * ENTER_PUK
       */
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
      /**
       * ENTER_CAN
       */
      handleCanRequest: (card) => {
        setWaitingForMsg(false)
        setPinVariant(AusweisPasscodeMode.CAN)
      },
      /**
       * ENTER_NEW_PIN
       */
      handleEnterNewPin: () => {
        setWaitingForMsg(false)
        setPinVariant(AusweisPasscodeMode.NEW_PIN)
      },
      /**
       * READER
       */
      handleCardInfo: (info) => {
        if (info) {
          setWaitingForMsg(false)
        }
      },
      /**
       * AUTH
       * NOTE: this is part of the
       * RUN_AUTH workflow
       */
      handleAuthResult: (url) => {
        finishFlow(url)
      },
      /**
       * CHANGE_PIN
       * NOTE: this is part of the
       * RUN_CHANGE_PIN workflow
       */
      handleChangePin: (success) => {
        /**
         * TODO:
         * check if this will work everywhere
         */
        if (success) {
          showSuccess(goBack)
        } else {
          /**
           * NOTE: success false comes in
           * when user presses CANCEL on NFC popup on iOS
           */
          showFailed(goBack)
        }
      },
    })

    /**
     * QUESTION: why do we reset handlers here ?
     */
    // return () => {
    //   aa2Module.resetHandlers()
    // }
  }, [])

  const title = useMemo(() => {
    if (pinVariant === AusweisPasscodeMode.PIN) {
      return 'To allow data exchange enter you six digit eID PIN'
    } else if (pinVariant === AusweisPasscodeMode.CAN) {
      return 'Before the third attempt, please enter the six digit Card Access Number (CAN)'
    } else if (pinVariant === AusweisPasscodeMode.PUK) {
      return 'PUK'
    } else if (pinVariant === AusweisPasscodeMode.NEW_PIN) {
      return 'Your new pin'
    } else if (pinVariant === AusweisPasscodeMode.VERIFY_NEW_PIN) {
      return 'Repeat new pin'
    } else {
      return ''
    }
  }, [pinVariant])

  const handleOnSubmit = async (passcode: string) => {
    setErrorText(null)

    if (pinVariant === AusweisPasscodeMode.PIN) {
      setWaitingForMsg(true)
      passcodeCommands.setPin(passcode)
    } else if (pinVariant === AusweisPasscodeMode.CAN) {
      setWaitingForMsg(true)
      passcodeCommands.setCan(passcode)
    } else if (pinVariant == AusweisPasscodeMode.PUK) {
      setWaitingForMsg(true)
      passcodeCommands.setPuk(passcode)
    } else if (pinVariant === AusweisPasscodeMode.NEW_PIN) {
      setPin(passcode)
      setPinVariant(AusweisPasscodeMode.VERIFY_NEW_PIN)
    } else if (pinVariant === AusweisPasscodeMode.VERIFY_NEW_PIN) {
      if (passcode === newPin) {
        setWaitingForMsg(true)
        aa2Module.setNewPin(passcode)
      } else {
        setErrorText("PINs don't match")
      }
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
        <Passcode.Container
          customStyles={{ marginTop: 42, position: 'relative' }}
        >
          <Passcode.Header title={title} errorTitle={title} />
          {pinVariant === AusweisPasscodeMode.CAN && (
            <JoloText
              customStyles={{
                marginBottom: 36,
                paddingHorizontal: 24,
              }}
              color={Colors.white80}
              kind={JoloTextKind.title}
              size={JoloTextSizes.mini}
            >
              You can find it in the bottom right on the front of your physical
              ID card
            </JoloText>
          )}
          {waitingForMsg && (
            <View
              style={{
                position: 'absolute',
                bottom: 20,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator color={Colors.activity} />
            </View>
          )}
          <Passcode.Input cellColor={Colors.chisinauGrey} />
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
