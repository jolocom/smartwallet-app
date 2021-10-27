import React, { useEffect, useMemo, useRef, useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { View } from 'react-native'
import { AusweisPasscodeMode, AusweisScannerState, eIDScreens } from '../types'
import { usePasscode } from '~/components/Passcode/context'
import { RouteProp, useRoute } from '@react-navigation/core'
import { AusweisStackParamList } from '..'
import { useAusweisInteraction, useAusweisScanner } from '../hooks'
import { aa2Module } from 'react-native-aa2-sdk'
import { useToasts } from '~/hooks/toasts'
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
    aa2Module.resetHandlers()
    //TODO: add badState handler
    aa2Module.setHandlers({
      handleAuthResult: (url) => {
        finishFlow(url).then(() => {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => {
              cancelInteraction()
            },
          })
        })
      },
      handlePinRequest: (card) => {
        updateScanner({
          state: AusweisScannerState.success,
          onDone: () => {
            setPinVariant(AusweisPasscodeMode.PIN)
            const errorText = `Wrong PIN, you used ${
              ALL_EID_PIN_ATTEMPTS - card.retryCounter
            }/${ALL_EID_PIN_ATTEMPTS} attempts`

            if (card.retryCounter !== ALL_EID_PIN_ATTEMPTS) {
              setErrorText(errorText)
            }
          },
        })
      },
      handlePukRequest: (card) => {
        updateScanner({
          state: AusweisScannerState.success,
          onDone: () => {
            setPinVariant(AusweisPasscodeMode.PUK)
            if (card.inoperative) {
              scheduleInfo({
                title: 'Oops!',
                message: "Seems like you're locked out of your card",
              })
              cancelInteraction()
            }
          },
        })
      },
      handleCanRequest: () => {
        updateScanner({
          state: AusweisScannerState.success,
          onDone: () => {
            setPinVariant(AusweisPasscodeMode.CAN)
          },
        })
      },
      handleCardInfo: (info) => {
        if (info && passcodeValue.current) {
          sendPasscodeCommand()
          updateScanner({ state: AusweisScannerState.loading })
        }
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
      }

      passcodeValue.current = null
    }
  }

  const handleOnSubmit = async (passcode: string) => {
    showScanner(() => {
      cancelInteraction()
    })
    passcodeValue.current = passcode
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
