import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { View, Platform, LayoutAnimation } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { RouteProp, useRoute } from '@react-navigation/core'
import { CardInfo } from 'react-native-aa2-sdk/js/types'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { usePasscode } from '~/components/Passcode/context'
import JoloText, { JoloTextKind } from '~/components/JoloText'

import { useToasts } from '~/hooks/toasts'
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

  const { scheduleInfo, scheduleWarning } = useToasts()

  const { passcodeCommands, cancelInteraction, finishFlow, closeAusweis } =
    useAusweisInteraction()
  const [pinVariant, setPinVariant] = useState(mode)
  const [errorText, setErrorText] = useState<string | null>(null)
  const { showScanner, updateScanner } = useAusweisScanner()

  const pinVariantRef = useRef(pinVariant)
  const newPasscodeRef = useRef('')

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

    const newPinHandler = () => {
      setPinVariant(AusweisPasscodeMode.NEW_PIN)
    }

    aa2Module.resetHandlers()
    //TODO: add badState handler
    aa2Module.setHandlers({
      handleCardRequest: () => {
        showScanner(cancelInteraction)
      },
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
        if (IS_ANDROID) {
          if (info) {
            updateScanner({ state: AusweisScannerState.loading })
          }
        }
      },
      /**
       * @RUN_CHANGE_PIN
       */
      handleChangePinCancel: () => {
        if (IS_ANDROID) {
          updateScanner({
            /**
             * NOTE:
             * this is confusing UX,
             * we show big success icon (indicating successful scanning process),
             * and then toast that pin wasn't changed
             */
            state: AusweisScannerState.success,
            onDone: () => {
              closeAusweis()
              scheduleWarning({
                title: "Pin wasn't changed",
                message: 'We were not able to complete update of your new pin',
              })
            },
          })
        } else {
          closeAusweis()
        }
      },
      /**
       * @RUN_CHANGE_PIN
       */
      handleChangePinSuccess: () => {
        const completeChangePinFlow = () => {
          closeAusweis()
          scheduleInfo({
            title: 'Action completed',
            message: 'You can use your new PIN now',
          })
        }
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => {
              completeChangePinFlow()
            },
          })
        } else {
          completeChangePinFlow()
        }
      },
      /**
       * @RUN_CHANGE_PIN
       */
      handleEnterNewPin: () => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: newPinHandler,
          })
        } else {
          newPinHandler()
        }
      },
    })
  }, [])

  useLayoutEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 300,
    })
  }, [pinVariant])

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

  const sendPasscodeCommand = async (passcode: string) => {
    setErrorText(null)
    if (pinVariantRef.current === AusweisPasscodeMode.PIN) {
      passcodeCommands.setPin(passcode)
    } else if (pinVariantRef.current === AusweisPasscodeMode.CAN) {
      passcodeCommands.setCan(passcode)
    } else if (pinVariantRef.current == AusweisPasscodeMode.PUK) {
      passcodeCommands.setPuk(passcode)
    } else if (pinVariantRef.current === AusweisPasscodeMode.NEW_PIN) {
      newPasscodeRef.current = passcode
      setPinVariant(AusweisPasscodeMode.VERIFY_NEW_PIN)
    } else if (pinVariantRef.current === AusweisPasscodeMode.VERIFY_NEW_PIN) {
      if (passcode === newPasscodeRef?.current) {
        aa2Module.setNewPin(passcode)
      } else {
        updateScanner({ state: AusweisScannerState.failure })
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
      <Passcode onSubmit={sendPasscodeCommand} length={6}>
        <PasscodeErrorSetter errorText={errorText} />
        <Passcode.Container>
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
