import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { View, Platform, LayoutAnimation } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import { StackActions } from '@react-navigation/routers'
import { CardError, CardInfo } from 'react-native-aa2-sdk/js/types'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { usePasscode } from '~/components/Passcode/context'
import { useToasts } from '~/hooks/toasts'
import { Colors } from '~/utils/colors'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { setPopup } from '~/modules/appState/actions'
import { useRevertToInitialState } from '~/hooks/generic'

import { AusweisStackParamList } from '..'
import {
  AusweisPasscodeMode,
  AusweisScannerState,
  CardInfoMode,
  eIDScreens,
  IAusweisRequest,
} from '../types'
import {
  useAusweisCancelBackHandler,
  useAusweisContext,
  useAusweisInteraction,
  useAusweisScanner,
  useCheckNFC,
} from '../hooks'
import { IAccessoryBtnProps } from '~/components/Passcode/types'

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
    }
  }, [errorText])

  useEffect(() => {
    if (runInputReset) {
      setPin('')
    }
  }, [runInputReset])

  return null
}

export const AusweisPasscode = () => {
  const { t } = useTranslation()
  const route =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.EnterPIN>>()
  const { mode, handlers, pinContext = AusweisPasscodeMode.PIN } = route.params
  const ausweisContext = useAusweisContext()

  const navigation = useNavigation()
  const dispatch = useDispatch()

  const { scheduleInfo } = useToasts()

  const [pinVariant, setPinVariant] = useState(mode)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [runInputReset, resetInput] = useState(false) // value to reset verification pin

  useAusweisCancelBackHandler()

  /**
   * Reverts back flag for resetting verification pin to make sure,
   * the prop 'runInputReset' is updated, so local PasscodeGlue
   * state can react on those changes
   */
  useRevertToInitialState(runInputReset, resetInput)

  const { passcodeCommands, finishFlow, closeAusweis, cancelFlow } =
    useAusweisInteraction()
  const { showScanner, updateScanner, handleDeactivatedCard } =
    useAusweisScanner()
  const { checkNfcSupport } = useCheckNFC()

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

  useEffect(() => {
    const pinHandler = (card: CardInfo) => {
      if (isTransportPin.current === true) {
        setPinVariant(AusweisPasscodeMode.TRANSPORT_PIN)
      } else {
        setPinVariant(AusweisPasscodeMode.PIN)
      }
      if (card.retryCounter !== ALL_EID_PIN_ATTEMPTS) {
        const errorText = t('Lock.errorMsg', {
          attempts: `${
            ALL_EID_PIN_ATTEMPTS - card.retryCounter
          }∕${ALL_EID_PIN_ATTEMPTS}`,
        })
        setErrorText(errorText)
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

    const canHandler = () => {
      if (canCounterRef.current > 0) {
        setErrorText(
          t('AusweisPasscode.pinWrongError', {
            pinVariant: 'CAN',
          }),
        )
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
        if (IS_ANDROID) {
          if (card) {
            if (card?.deactivated) {
              handleDeactivatedCard()
            } else {
              updateScanner({ state: AusweisScannerState.loading })
            }
          } else {
            /**
             * When connection to the NFC tag was interrupted
             * stop the loading
             */
            updateScanner({ state: AusweisScannerState.idle })
          }
        }
      },
      handleCardRequest: () => {
        if (IS_ANDROID) {
          showScanner(cancelFlow)
        }
      },
      handleAuthFailed: (url: string, message: string) => {
        if (Platform.OS === 'ios') {
          closeAusweis()
        }
        finishFlow(url, message)
      },
      handleAuthSuccess: (url: string) => {
        if (IS_ANDROID) {
          finishFlow(url).then(() => {
            updateScanner({
              state: AusweisScannerState.success,
              onDone: () => {
                closeAusweis()
              },
            })
          })
        } else {
          closeAusweis()
          finishFlow(url)
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
        },
      }),
    )
  }

  const sendPasscodeCommand = (passcode: string) => {
    return checkNfcSupport(async () => {
      if (Platform.OS === 'ios') {
        dispatch(setPopup(true))
      }
      setErrorText(null)
      if (pinVariantRef.current === AusweisPasscodeMode.PIN) {
        passcodeCommands.setPin(passcode)
      } else if (pinVariantRef.current === AusweisPasscodeMode.TRANSPORT_PIN) {
        passcodeCommands.setPin(passcode)
      } else if (pinVariantRef.current === AusweisPasscodeMode.CAN) {
        canCounterRef.current++
        passcodeCommands.setCan(passcode)
      } else if (pinVariantRef.current == AusweisPasscodeMode.PUK) {
        pukCounterRef.current++
        try {
          await passcodeCommands.setPuk(passcode)
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
      } else if (pinVariantRef.current === AusweisPasscodeMode.NEW_PIN) {
        newPasscodeRef.current = passcode
        setPinVariant(AusweisPasscodeMode.VERIFY_NEW_PIN)
      } else if (pinVariantRef.current === AusweisPasscodeMode.VERIFY_NEW_PIN) {
        if (passcode === newPasscodeRef?.current) {
          aa2Module.setNewPin(passcode)
        } else {
          setTimeout(() => {
            setErrorText(t('AusweisPasscode.pinMatchError'))
          }, 100)
        }
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

  const renderAccessoryBtn = () => {
    let props: IAccessoryBtnProps = {
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
      case AusweisPasscodeMode.PIN:
        title = t('AusweisPasscode.pinForgotBtn')
        onPress = () => handleNavigate(eIDScreens.ForgotPin)
        break
      case AusweisPasscodeMode.TRANSPORT_PIN:
        title = t('AusweisPasscode.transportPinBtn')
        onPress = () => handleNavigate(eIDScreens.AusweisTransportPinInfo)
        break
      case AusweisPasscodeMode.VERIFY_NEW_PIN:
        title = t('VerifyPasscode.resetBtn')
        onPress = () => {
          resetInput(true)
          setPinVariant(AusweisPasscodeMode.NEW_PIN)
        }
        break
      default:
        break
    }

    if (title) {
      return <Passcode.AccessoryBtn title={title} onPress={onPress} />
    }

    return null
  }

  const checkIsEmptyContext = () => {
    return !Object.keys(ausweisContext).some((k) => {
      const key = k as keyof IAusweisRequest
      if (Array.isArray(k)) {
        return ausweisContext[key].length
      } else {
        return Boolean(key)
      }
    })
  }

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
      <Passcode onSubmit={sendPasscodeCommand} length={getPasscodeLength()}>
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
        <Passcode.Container customStyles={{ justifyContent: 'center' }}>
          {renderAccessoryBtn()}
          <Passcode.Keyboard />
        </Passcode.Container>
      </Passcode>
    </ScreenContainer>
  )
}
