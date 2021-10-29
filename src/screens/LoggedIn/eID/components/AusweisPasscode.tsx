import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, View, Platform } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { RouteProp, useRoute } from '@react-navigation/core'
import { CardInfo } from 'react-native-aa2-sdk/js/types'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { usePasscode } from '~/components/Passcode/context'
import JoloText, { JoloTextKind } from '~/components/JoloText'

import { useToasts } from '~/hooks/toasts'
import { useGoBack } from '~/hooks/navigation'

import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

import { AusweisPasscodeMode, AusweisScannerState, eIDScreens } from '../types'
import { useAusweisInteraction, useAusweisScanner } from '../hooks'
import { AusweisStackParamList } from '..'

const ALL_EID_PIN_ATTEMPTS = 3
const IS_ANDROID = Platform.OS === 'android'

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

export const AusweisPasscode = () => {
  const { mode } =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.EnterPIN>>().params

  const { scheduleInfo } = useToasts()
  const goBack = useGoBack()

  const [waitingForMsg, setWaitingForMsg] = useState(false)
  const [newPin, setPin] = useState('')
  const { passcodeCommands, cancelInteraction, finishFlow, closeAusweis } =
    useAusweisInteraction()
  const [pinVariant, setPinVariant] = useState(mode)
  const [errorText, setErrorText] = useState<string | null>(null)
  const { showScanner, updateScanner } = useAusweisScanner()
  const passcodeValue = useRef<null | string>(null)
  const pinVariantRef = useRef(pinVariant)

  useEffect(() => {
    pinVariantRef.current = pinVariant
  }, [pinVariant])

  useEffect(() => {
    const pinHandler = (card: CardInfo) => {
      setPinVariant(AusweisPasscodeMode.PIN)
      const errorText = `Wrong PIN, you used ${
        ALL_EID_PIN_ATTEMPTS - card.retryCounter
      }/${ALL_EID_PIN_ATTEMPTS} attempts`

      if (card.retryCounter !== ALL_EID_PIN_ATTEMPTS) {
        setErrorText(errorText)
      }
    }

    const pukHandler = (card: CardInfo) => {
      setPinVariant(AusweisPasscodeMode.PUK)
      if (card.inoperative) {
        scheduleInfo({
          title: 'Oops!',
          message: "Seems like you're locked out of your card",
        })
        cancelInteraction()
      }
    }

    const canHandler = () => {
      setPinVariant(AusweisPasscodeMode.CAN)
    }

    aa2Module.resetHandlers()
    //TODO: add badState handler
    aa2Module.setHandlers({
      handleAuthResult: (url) => {
        if (IS_ANDROID) {
          finishFlow(url).then(() => {
            updateScanner({
              state: AusweisScannerState.success,
              onDone: closeAusweis,
            })
          })
        } else {
          // TODO: at some point we should show a loader or smth
          finishFlow(url).then(closeAusweis)
        }
      },
      handlePinRequest: (card) => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => {
              pinHandler(card)
            },
          })
        } else {
          pinHandler(card)
        }
      },
      /**
       * ENTER_PUK
       */
      handlePukRequest: (card) => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => {
              pukHandler(card)
            },
          })
        } else {
          pukHandler(card)
        }
      },
      handleCanRequest: () => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: canHandler,
          })
        } else {
          canHandler()
        }
      },
      handleCardInfo: (info) => {
        if (info && passcodeValue.current) {
          sendPasscodeCommand()
          if (IS_ANDROID) {
            updateScanner({ state: AusweisScannerState.loading })
          }
        }
      },
      /**
       * @RUN_CHANGE_PIN
       */
      handleChangePinCancel: () => {
        goBack()
      },
      handleChangePinSuccess: () => {
        goBack()
      },
    })
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

  const sendPasscodeCommand = () => {
    if (passcodeValue.current) {
      const passcodeNumber = passcodeValue.current

      setErrorText(null)

      if (pinVariantRef.current === AusweisPasscodeMode.PIN) {
        passcodeCommands.setPin(passcodeNumber)
      } else if (pinVariantRef.current === AusweisPasscodeMode.CAN) {
        passcodeCommands.setCan(passcodeNumber)
      } else if (pinVariantRef.current == AusweisPasscodeMode.PUK) {
        passcodeCommands.setPuk(passcodeNumber)
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

      passcodeValue.current = null
    }
  }

  const handleOnSubmit = async (passcode: string) => {
    passcodeValue.current = passcode

    if (IS_ANDROID) {
      showScanner(() => {
        cancelInteraction()
      })
    } else {
      sendPasscodeCommand()
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
