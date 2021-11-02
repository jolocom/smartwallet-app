import React, { useEffect, useMemo, useRef, useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { Platform, View } from 'react-native'
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
import { CardInfo } from 'react-native-aa2-sdk/js/types'
import useTranslation from '~/hooks/useTranslation'

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

/**
 * QUESTION:
 * How do we handle error in send cmds (results in error prop on ENTER_PIN msg)
 */
export const AusweisPasscode = () => {
  const { t } = useTranslation()
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
    const pinHandler = (card: CardInfo) => {
      setPinVariant(AusweisPasscodeMode.PIN)

      if (card.retryCounter !== ALL_EID_PIN_ATTEMPTS) {
        const errorText = t('Lock.errorMsg', {
          attempts: `${
            ALL_EID_PIN_ATTEMPTS - card.retryCounter
          } / ${ALL_EID_PIN_ATTEMPTS}`,
        })
        setErrorText(errorText)
      }
    }

    const pukHandler = (card: CardInfo) => {
      setPinVariant(AusweisPasscodeMode.PUK)
      if (card.inoperative) {
        //NOTE: this will be replaced with an overlay or removed altogether.
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
        if (IS_ANDROID) {
          if (info && passcodeValue.current) {
            sendPasscodeCommand()
            updateScanner({ state: AusweisScannerState.loading })
          }
        }
      },
    })

    return () => {
      aa2Module.resetHandlers()
    }
  }, [])

  const title = useMemo(() => {
    if (pinVariant === AusweisPasscodeMode.PIN) {
      return t('AusweisPasscode.authPinHeader')
    } else if (pinVariant === AusweisPasscodeMode.CAN) {
      return t('AusweisPasscode.canHeader')
    } else if (pinVariant === AusweisPasscodeMode.PUK) {
      return t('AusweisPasscode.pukHeader')
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
        <Passcode.Container customStyles={{ marginTop: 42 }}>
          <Passcode.Header title={title} errorTitle={title} />
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
