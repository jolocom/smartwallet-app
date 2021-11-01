import React, { useEffect, useMemo, useRef, useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { Platform, View } from 'react-native'
import { AusweisPasscodeMode, AusweisScannerState, eIDScreens } from '../types'
import { usePasscode } from '~/components/Passcode/context'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import { AusweisStackParamList } from '..'
import { useAusweisInteraction, useAusweisScanner } from '../hooks'
import { aa2Module } from 'react-native-aa2-sdk'
import { useToasts } from '~/hooks/toasts'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { CardInfo } from 'react-native-aa2-sdk/js/types'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import BP from '~/utils/breakpoints'

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
  const route =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.EnterPIN>>()
  const { mode } = route.params

  const navigation = useNavigation()

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
    setPinVariant(mode)
  }, [route])

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
      if (card.inoperative) {
        scheduleInfo({
          title: 'Oops!',
          message: "Seems like you're locked out of your card",
        })
        cancelInteraction()
      } else {
        navigation.navigate(eIDScreens.PukLock)
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
      return 'To allow data exchange enter you six digit eID PIN'
    } else if (pinVariant === AusweisPasscodeMode.CAN) {
      return 'Before the third attempt, please enter the six digit Card Access Number (CAN)'
    } else if (pinVariant === AusweisPasscodeMode.PUK) {
      return 'To restore access to your card please enter PUK number'
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

  const getPasscodeLength = () => {
    switch (pinVariant) {
      case AusweisPasscodeMode.CAN:
      case AusweisPasscodeMode.PIN:
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
    let screen: eIDScreens | undefined
    let title: string | undefined

    switch (pinVariant) {
      case AusweisPasscodeMode.PUK:
        screen = eIDScreens.PukInfo
        title = 'Where to find the PUK?'
        break
      default:
        break
    }

    if (screen && title) {
      return (
        <Passcode.AccessoryBtn
          title={title}
          onPress={() => navigation.navigate(screen!)}
        />
      )
    }
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.mainDark}
      customStyles={{
        justifyContent: 'flex-start',
      }}
    >
      <NavigationHeader
        type={NavHeaderType.Close}
        onPress={cancelInteraction}
      />
      <Passcode onSubmit={handleOnSubmit} length={getPasscodeLength()}>
        <PasscodeErrorSetter errorText={errorText} />
        <Passcode.Container
          customStyles={{
            marginTop: BP({ default: 0, medium: 8, large: 36 }),
          }}
        >
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
          <View style={{ paddingHorizontal: 8 }}>
            <Passcode.Input
              cellColor={Colors.chisinauGrey}
              numberOfLines={getPasscodeNrLines()}
            />
          </View>
          <View style={{ position: 'relative', alignItems: 'center' }}>
            <Passcode.Error />
          </View>
        </Passcode.Container>
        <Passcode.Container customStyles={{ justifyContent: 'flex-end' }}>
          {renderAccessoryBtn()}
          <Passcode.Keyboard />
        </Passcode.Container>
      </Passcode>
    </ScreenContainer>
  )
}
