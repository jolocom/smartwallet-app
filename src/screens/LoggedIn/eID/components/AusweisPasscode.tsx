import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import { View, Platform, LayoutAnimation } from 'react-native'
import { aa2Module } from '@jolocom/react-native-ausweis'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { StackActions } from '@react-navigation/routers'
import { CardError, CardInfo } from '@jolocom/react-native-ausweis/js/types'
import { Commands } from '@jolocom/react-native-ausweis/js/commandTypes'
import { StackNavigationProp } from '@react-navigation/stack'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { usePasscode } from '~/components/Passcode/context'
import { useToasts } from '~/hooks/toasts'
import { Colors } from '~/utils/colors'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { useRevertToInitialState } from '~/hooks/generic'

import { AusweisStackParamList } from '..'
import {
  AusweisFlow,
  AusweisPasscodeMode,
  AusweisScannerState,
  CardInfoMode,
  eIDScreens,
  IAusweisRequest,
} from '../types'
import eIDHooks from '../hooks'
import { getAusweisReaderState } from '~/modules/ausweis/selectors'
import { ExtraActionProps } from '~/components/Passcode/types'
import JoloText from '~/components/JoloText'
import { Trans } from 'react-i18next'
import { JoloTextSizes } from '~/utils/fonts'
import { useCheckNFC } from '~/hooks/nfc'

const ALL_EID_PIN_ATTEMPTS = 3
const IS_ANDROID = Platform.OS === 'android'

interface PasscodeErrorSetterProps {
  errorText: string | null
  runInputReset: boolean
}
/**
 * NOTE:
 * this component can only be used inside Passcode context
 */
const PasscodeGlue: React.FC<PasscodeErrorSetterProps> = ({
  errorText,
  runInputReset,
}) => {
  const { setPinError, setPinErrorText, setPin } = usePasscode()

  useEffect(() => {
    if (Boolean(errorText)) {
      setPinError(true) // color error cells
      setPinErrorText(errorText) // show error text
    } else {
      setPinError(false)
      setPinErrorText(null)
    }
  }, [errorText])

  useEffect(() => {
    if (runInputReset) {
      setPin('')
    }
  }, [runInputReset])

  return null
}

/**
 * TODO: create generic type
 * for props to extends with navigation
 * property
 */
type AusweisPasscodeProps = StackNavigationProp<
  AusweisStackParamList,
  eIDScreens.EnterPIN
>

export const AusweisPasscode = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<AusweisPasscodeProps>()
  const route =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.EnterPIN>>()
  const {
    mode,
    handlers,
    pinContext = AusweisPasscodeMode.PIN,
    flow,
  } = route.params
  const ausweisContext = eIDHooks.useAusweisContext()
  const isCardTouched = useSelector(getAusweisReaderState)

  const { scheduleInfo } = useToasts()

  const [pinVariant, setPinVariant] = useState(mode)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [runInputReset, resetInput] = useState(false) // value to reset verification pin

  eIDHooks.useAusweisCancelBackHandler()

  /**
   * Reverts back flag for resetting verification pin to make sure,
   * the prop 'runInputReset' is updated, so local PasscodeGlue
   * state can react on those changes
   */
  useRevertToInitialState(runInputReset, resetInput)

  const {
    passcodeCommands,
    finishFlow,
    closeAusweis,
    cancelFlow,
    cancelInteraction,
  } = eIDHooks.useAusweisInteraction()
  const { showScanner, updateScanner } = eIDHooks.useAusweisScanner()
  const { handleDeactivatedCard } = eIDHooks.useDeactivatedCard()
  const checkNfcSupport = useCheckNFC()

  const pinVariantRef = useRef(pinVariant)
  const newPasscodeRef = useRef('')
  const shouldShowPukWarning = useRef(
    mode === AusweisPasscodeMode.PUK ? false : true,
  )
  const isTransportPin = useRef(false)
  const canCounterRef = useRef(0)
  const pukCounterRef = useRef(0)

  useEffect(() => {
    if (pinContext === AusweisPasscodeMode.TRANSPORT_PIN) {
      isTransportPin.current = true
    } else if (pinContext === AusweisPasscodeMode.PIN) {
      isTransportPin.current = false
    }
  }, [pinContext])

  useEffect(() => {
    pinVariantRef.current = pinVariant
  }, [pinVariant])

  useEffect(() => {
    setPinVariant(mode)
  }, [route])

  const showPinError = (card: CardInfo) => {
    const errorText = t('Lock.errorMsg', {
      attempts: `${
        ALL_EID_PIN_ATTEMPTS - card.retryCounter
      }∕${ALL_EID_PIN_ATTEMPTS}`,
    })
    setErrorText(errorText)
  }

  useEffect(() => {
    const pinHandler = (card: CardInfo) => {
      if (isTransportPin.current === true) {
        setPinVariant(AusweisPasscodeMode.TRANSPORT_PIN)
      } else {
        setPinVariant(AusweisPasscodeMode.PIN)
      }
      if (
        card.retryCounter !== ALL_EID_PIN_ATTEMPTS &&
        pinVariantRef.current !== AusweisPasscodeMode.CAN
      ) {
        showPinError(card)
      }
    }

    const pukHandler = (card: CardInfo) => {
      if (pukCounterRef.current > 0) {
        setErrorText(
          t('AusweisPasscode.pinWrongError', {
            pinVariant: 'PUK',
          }),
        )
      }
      if (shouldShowPukWarning.current) {
        navigation.navigate(eIDScreens.PukLock)
        shouldShowPukWarning.current = false
      } else {
        setPinVariant(AusweisPasscodeMode.PUK)
      }
    }

    const canHandler = (card: CardInfo) => {
      if (canCounterRef.current > 0) {
        setErrorText(
          t('AusweisPasscode.pinWrongError', {
            pinVariant: 'CAN',
          }),
        )
      } else {
        showPinError(card)
      }
      setPinVariant(AusweisPasscodeMode.CAN)
    }

    const newPinHandler = () => {
      setPinVariant(AusweisPasscodeMode.NEW_PIN)
    }

    aa2Module.resetHandlers()
    //TODO: add badState handler
    aa2Module.setHandlers({
      handleCardInfo: (card) => {
        if (card !== null) {
          if (card?.deactivated) {
            handleDeactivatedCard()
          } else {
            if (IS_ANDROID) {
              updateScanner({ state: AusweisScannerState.loading })
            }
          }
        } else {
          /**
           * When connection to the NFC tag was interrupted
           * stop the loading
           */
          if (IS_ANDROID) {
            updateScanner({ state: AusweisScannerState.idle })
          }
        }
      },
      handleCardRequest: () => {
        if (IS_ANDROID) {
          showScanner(cancelInteraction)
        }
      },
      handleAuthFailed: () => {
        if (IS_ANDROID) {
          /*
           * NOTE: This would happen in the case when there is no internet connection,
           * or the user pressed the Cancel button. In the latter case, the scanner update
           * will be ignored internally.
           */
          updateScanner({
            state: AusweisScannerState.failure,
            onDone: () => {
              /**
               * QUESTION:
               * shall we show toast here, something like:
               * we were unable to finish interaction because
               * you were not connected to the internet
               */
              closeAusweis()
            },
          })
        } else {
          closeAusweis()
        }
      },
      handleAuthSuccess: (url: string) => {
        if (IS_ANDROID) {
          finishFlow(url)
            .then(() => {
              updateScanner({
                state: AusweisScannerState.success,
                onDone: () => {
                  closeAusweis()
                },
              })
            })
            .catch(() => {
              /**
               * An error is thrown and unhandled in finishFlow
               * only if device is not connected to the internet
               */
              updateScanner({
                state: AusweisScannerState.failure,
                onDone: () => {
                  /**
                   * QUESTION:
                   * shall we show toast here, something like:
                   * we were unable to finish interaction because
                   * you were not connected to the internet
                   */
                  closeAusweis()
                },
              })
            })
        } else {
          /**
           * An error is thrown and unhandled in finishFlow
           * only if device is not connected to the internet
           */
          finishFlow(url)
            .then(() => {
              closeAusweis()
            })
            .catch(() => {
              /**
               * QUESTION:
               * shall we show toast here, something like:
               * we were unable to finish interaction because
               * you were not connected to the internet
               */
            })
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
        const pukRequestHandler = () => {
          if (flow === AusweisFlow.auth || flow === AusweisFlow.unlock) {
            // continue with puk
            pukHandler(card)
          } else {
            /**
             * User should be able to set PUK only with 'Unlock
             * blocked card' within ChangePin flow, all other use cases
             * of ChangePin flow should redirect to AusweisIdentity to
             * "Unlock blocked card"
             */
            navigation.dispatch(
              StackActions.replace(ScreenNames.TransparentModals, {
                screen: ScreenNames.AusweisCardInfo,
                params: {
                  mode: CardInfoMode.standaloneUnblock,
                  onDismiss: () => {
                    aa2Module.resetHandlers()
                    cancelFlow()
                  },
                },
              }),
            )
          }
        }
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: pukRequestHandler,
          })
        } else {
          pukRequestHandler()
        }
      },
      handleCanRequest: (card) => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => canHandler(card),
          })
        } else {
          canHandler(card)
        }
      },
      /**
       * @RUN_CHANGE_PIN
       */
      handleChangePinCancel: () => {
        /**
         * NOTE:
         * AusweisChangePin screen is part of the eID stack;
         */
        navigation.dispatch(StackActions.popToTop())
      },
      /**
       * @RUN_CHANGE_PIN
       */
      handleChangePinSuccess: () => {
        const completeChangePinFlow = () => {
          navigation.dispatch(StackActions.popToTop())
          scheduleInfo({
            title: t('Toasts.ausweisChangePinSuccessHeader'),
            message: t('Toasts.ausweisChangePinSuccessMsg'),
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
      /**
       * NOTE: overwrite handlers for this screen
       * with handlers that comes through navigation
       */
      ...handlers,
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
      return t('AusweisPasscode.authPinHeader')
    } else if (pinVariant === AusweisPasscodeMode.TRANSPORT_PIN) {
      return t('AusweisPasscode.transportPinHeader')
    } else if (pinVariant === AusweisPasscodeMode.CAN) {
      return t('AusweisPasscode.canHeader')
    } else if (pinVariant === AusweisPasscodeMode.PUK) {
      return t('AusweisPasscode.pukHeader')
    } else if (pinVariant === AusweisPasscodeMode.NEW_PIN) {
      return t('AusweisPasscode.newPinHeader')
    } else if (pinVariant === AusweisPasscodeMode.VERIFY_NEW_PIN) {
      return t('AusweisPasscode.repeatNewPinHeader')
    } else {
      return ''
    }
  }, [pinVariant])

  const handleCardIsBlocked = () => {
    navigation.dispatch(
      StackActions.replace(ScreenNames.TransparentModals, {
        screen: ScreenNames.AusweisCardInfo,
        params: {
          mode: CardInfoMode.blocked,
          onDismiss: closeAusweis,
        },
      }),
    )
  }

  const sendPasscodeCommand = async (command: Commands, value: string) => {
    if (IS_ANDROID && isCardTouched) {
      showScanner(cancelInteraction, { state: AusweisScannerState.loading })
    }

    switch (command) {
      case Commands.setPin:
        return passcodeCommands.setPin(value)
      case Commands.setCan:
        return passcodeCommands.setCan(value)
      case Commands.setPuk:
        return passcodeCommands.setPuk(value)
      case Commands.setNewPin:
        return passcodeCommands.setNewPin(value)
      default:
        throw new Error('Unsupported command type')
    }
  }

  const handleSubmit = async (passcode: string) => {
    checkNfcSupport(async () => {
      setErrorText(null)

      switch (pinVariantRef.current) {
        case AusweisPasscodeMode.PIN:
        case AusweisPasscodeMode.TRANSPORT_PIN:
          sendPasscodeCommand(Commands.setPin, passcode)
          return
        case AusweisPasscodeMode.CAN:
          canCounterRef.current++
          sendPasscodeCommand(Commands.setCan, passcode)
          return
        case AusweisPasscodeMode.PUK:
          pukCounterRef.current++
          try {
            await sendPasscodeCommand(Commands.setPuk, passcode)
          } catch (e) {
            if (e === CardError.cardIsBlocked) {
              if (IS_ANDROID) {
                updateScanner({
                  state: AusweisScannerState.failure,
                  onDone: handleCardIsBlocked,
                })
              } else {
                handleCardIsBlocked()
              }
            }
          }
          return
        case AusweisPasscodeMode.NEW_PIN:
          newPasscodeRef.current = passcode
          setPinVariant(AusweisPasscodeMode.VERIFY_NEW_PIN)
          return
        case AusweisPasscodeMode.VERIFY_NEW_PIN:
          if (passcode === newPasscodeRef?.current) {
            await sendPasscodeCommand(Commands.setNewPin, passcode)
          } else {
            setTimeout(() => {
              setErrorText(t('AusweisPasscode.pinMatchError'))
            }, 100)
          }

          return
      }
    })
  }

  const getPasscodeLength = () => {
    switch (pinVariant) {
      case AusweisPasscodeMode.TRANSPORT_PIN:
        return 5
      case AusweisPasscodeMode.CAN:
      case AusweisPasscodeMode.PIN:
      case AusweisPasscodeMode.NEW_PIN:
      case AusweisPasscodeMode.VERIFY_NEW_PIN:
        return 6
      case AusweisPasscodeMode.PUK:
        return 10
      default:
        return 4
    }
  }

  const getPasscodeNrLines = () => {
    switch (pinVariant) {
      case AusweisPasscodeMode.PUK:
        return 2
      default:
        return 1
    }
  }

  const renderExtraActionBtn = () => {
    const props: ExtraActionProps = {
      title: '',
      onPress: () => {},
    }
    let { title, onPress } = props

    const handleNavigate = navigation.navigate

    switch (pinVariant) {
      case AusweisPasscodeMode.PUK:
        title = t('AusweisPasscode.pukBtn')
        onPress = () => handleNavigate(eIDScreens.PukInfo)
        break
      case AusweisPasscodeMode.CAN:
        title = t('AusweisPasscode.canBtn')
        onPress = () => handleNavigate(eIDScreens.CanInfo)
        break
      case AusweisPasscodeMode.TRANSPORT_PIN:
        title = t('AusweisPasscode.transportPinBtn')
        onPress = () => handleNavigate(eIDScreens.AusweisTransportPinInfo)
        break
      case AusweisPasscodeMode.VERIFY_NEW_PIN:
        title = t('VerifyPasscode.resetBtn')
        onPress = () => {
          resetInput(true)
          setErrorText(null)
          setPinVariant(AusweisPasscodeMode.NEW_PIN)
          setErrorText(null)
        }
        break
      case AusweisPasscodeMode.PIN:
        title = t('AusweisPasscode.pinForgotBtn')
        onPress = () => handleNavigate(eIDScreens.PinInfo)
        break
      default:
        break
    }

    if (title) {
      return (
        <Passcode.ExtraAction onPress={onPress}>
          {pinVariant === AusweisPasscodeMode.PIN ? (
            <Trans>
              <JoloText customStyles={{ textAlign: 'center' }}>
                {title}
                <JoloText color={Colors.activity} />
              </JoloText>
            </Trans>
          ) : (
            title
          )}
        </Passcode.ExtraAction>
      )
    }

    return null
  }

  const checkIsEmptyContext = () =>
    !Object.keys(ausweisContext).some((k) => {
      const key = k as keyof IAusweisRequest
      if (Array.isArray(k)) {
        return ausweisContext[key].length
      } else {
        return Boolean(key)
      }
    })

  const handleClosePasscode = () => {
    cancelFlow()
    if (!checkIsEmptyContext()) {
      /**
       * @RUN_AUTH flow
       * NOTE:
       * handleAuthFailed handler doesn't navigate from the stack,
       * because it is done by the scanner, therefore,
       * in the case when we press close btn we should
       * also navigate outside of the eID stack;
       * This is different for the RUN_CHANGE_PIN flow, where
       * the handleChangePinCancel navigates back to the AusweisChangePin screen
       */
      if (IS_ANDROID) {
        closeAusweis()
      }
    }
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.mainDark}
      hasHeaderClose
      onClose={handleClosePasscode}
      customStyles={{
        justifyContent: 'flex-start',
      }}
    >
      <Passcode onSubmit={handleSubmit} length={getPasscodeLength()}>
        <PasscodeGlue errorText={errorText} runInputReset={runInputReset} />
        <Passcode.Container
          customStyles={{
            marginTop: BP({ default: 0, medium: 8, large: 36 }),
          }}
        >
          <View
            style={{ paddingHorizontal: 8, flex: 1, justifyContent: 'center' }}
          >
            <Passcode.Header title={title} errorTitle={title} />
            <Passcode.Input
              cellColor={Colors.chisinauGrey}
              numberOfLines={getPasscodeNrLines()}
            />
            <Passcode.Error />
          </View>
        </Passcode.Container>
        <Passcode.Container customStyles={{ justifyContent: 'flex-end' }}>
          {renderExtraActionBtn()}
          <Passcode.Keyboard />
        </Passcode.Container>
      </Passcode>
    </ScreenContainer>
  )
}
