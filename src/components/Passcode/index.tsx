import React, { useEffect, useMemo, useState } from 'react'
import { Modal, View, Text } from 'react-native'
import PasscodeForgot from './PasscodeForgot'
import PasscodeHeader from './PasscodeHeader'
import PasscodeInput from './PasscodeInput'
import { IPasscodeProps, IPasscodeComposition } from './types'
import { PasscodeContext } from './context'
import PasscodeKeyboard from './PasscodeKeyboard'
import PasscodeContainer from './PasscodeContainer'
import { Colors } from '~/utils/colors'
import { SettingKeys, useSettings } from '~/hooks/settings'
import JoloText, { JoloTextKind } from '../JoloText'
import Space from '../Space'
import { Fonts, JoloTextSizes } from '~/utils/fonts'
import BtnGroup from '../BtnGroup'
import Btn, { BtnTypes } from '../Btn'
import ScreenContainer from '../ScreenContainer'
import AbsoluteBottom from '../AbsoluteBottom'

const PIN_ATTEMPTS = 3
const PIN_ATTEMPTS_CYCLES = 3
const INITIAL_COUNTDOWN = 20 * 1

// TODO: translation
const useDisableApp = (pinError: boolean) => {
  const [isAppDisabled, setIsAppDisabled] = useState(false)
  /**
   * TODO: Nr of minutes will vary
   * based on an attempt cycle
   */
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN)
  const [startCountdown, setStartCountdown] = useState(false)
  /**
   * TODO: Nr of attempts will vary
   * based on an attempt cycle
   */
  const [pinAttemptsLeft, setPinAttemptsLeft] = useState(PIN_ATTEMPTS)

  const [attemptCyclesLeft, setAttemptCyclesLeft] =
    useState<number | undefined>(undefined)
  const { get, set } = useSettings()
  const getPinNrAttemptCyclesLeft = async (): Promise<
    { value: number } | undefined
  > => get(SettingKeys.pinNrAttemptsLeft)
  const storePinNrAttemptCyclesLeft = async (value: number) =>
    set(SettingKeys.pinNrAttemptsLeft, { value })

  const [isRestoreAccess, setIsRestoreAccess] = useState(false)

  /**
   * reset stored value back to initial PIN_ATTEMPTS_CYCLES nr
   * TODO: remove after full implementation
   */
  // useEffect(() => {
  //   ;(async () => {
  //     await storePinNrAttemptCyclesLeft(PIN_ATTEMPTS_CYCLES)
  //   })()
  // }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const response = await getPinNrAttemptCyclesLeft()
        if (response?.value !== undefined) {
          setAttemptCyclesLeft(response.value)
        } else {
          // initialize nr of pin attempt cycles left
          await storePinNrAttemptCyclesLeft(PIN_ATTEMPTS_CYCLES)
          setAttemptCyclesLeft(PIN_ATTEMPTS_CYCLES)
        }
      } catch (e) {
        console.log('Error retrieving or storing nr of pin attempt cycles left')
      }
    })()
  }, [])

  // count amount of wrong pins provided
  useEffect(() => {
    if (pinError) {
      setPinAttemptsLeft((prev) => --prev)
    }
  }, [pinError])

  // disable the app when no attempt is left
  useEffect(() => {
    if (pinAttemptsLeft === 0) {
      ;(async () => {
        if (attemptCyclesLeft) {
          await storePinNrAttemptCyclesLeft(attemptCyclesLeft - 1)
          setAttemptCyclesLeft(attemptCyclesLeft - 1)
        }
      })()
      setIsAppDisabled(true)
      setStartCountdown(true)
    }
  }, [pinAttemptsLeft])

  // countdown
  useEffect(() => {
    let countdownId: number | undefined
    const clearCountdown = (id: number | undefined) => {
      if (id) {
        clearInterval(id)
      }
    }
    if (startCountdown) {
      countdownId = setInterval(() => {
        setCountdown((prev) => --prev)
      }, 1000)
    } else {
      clearCountdown(countdownId)
    }
    return () => {
      clearCountdown(countdownId)
    }
  }, [startCountdown])

  // enable app when the countdown expired
  useEffect(() => {
    if (countdown === 0) {
      if (attemptCyclesLeft && attemptCyclesLeft > 0) {
        setIsAppDisabled(false)
      }
    }
  }, [countdown, attemptCyclesLeft])

  useEffect(() => {
    if (attemptCyclesLeft === 0) {
      setIsAppDisabled(true)
      setIsRestoreAccess(true)
    }
  }, [attemptCyclesLeft])

  // disable countdown
  useEffect(() => {
    if (isRestoreAccess) {
      setStartCountdown(false)
    }
  }, [isRestoreAccess])

  /**
   * start countdown when the app is disabled
   * reset countdown when the app is enabled
   */
  useEffect(() => {
    if (!isAppDisabled) {
      /**
       * TODO: Nr of minutes will vary
       * based on an attempt cycle
       */
      setCountdown(INITIAL_COUNTDOWN)
      setStartCountdown(false)
      setPinAttemptsLeft(PIN_ATTEMPTS)
    }
  }, [isAppDisabled])

  return {
    isAppDisabled,
    pinAttemptsLeft,
    countdown,
    isRestoreAccess,
    startCountdown,
  }
}

const Passcode: React.FC<IPasscodeProps> & IPasscodeComposition = ({
  children,
  onSubmit,
}) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinSuccess, setPinSuccess] = useState(false)

  const {
    isAppDisabled,
    pinAttemptsLeft,
    countdown,
    isRestoreAccess,
    startCountdown,
  } = useDisableApp(pinError)

  const handleSubmit = async () => {
    try {
      await onSubmit(pin)
      setPinSuccess(true)
      setTimeout(() => {
        setPin('')
        setPinSuccess(false)
      }, 500)
    } catch (e) {
      setPinError(true)
    }
  }

  // submit when full pin is provided
  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit()
    }
  }, [pin])

  // this will remove the error after 1000 ms
  useEffect(() => {
    let id: number | undefined
    if (pinError) {
      id = setTimeout(() => {
        /**
         * NOTE at this point pinAttemptsLeft is still an old value,
         * therefore we compare with 1 not 0
         */
        if (pinAttemptsLeft > 1) {
          setPinError(false)
          setPin('')
        }
      }, 1000)
    }
    return () => {
      if (id) {
        clearTimeout(id)
      }
    }
  }, [pinError])

  useEffect(() => {
    if (!isAppDisabled) {
      setPinError(false)
      setPin('')
    }
  }, [isAppDisabled])

  const contextValue = useMemo(
    () => ({
      pin,
      setPin,
      pinError,
      pinSuccess,
    }),
    [pin, setPin, pinError, pinSuccess],
  )

  // eslint-disable-next-line
  const handleAccessRestore = () => {}

  return (
    <>
      <PasscodeContext.Provider value={contextValue} children={children} />
      <Modal
        animationType="fade"
        transparent
        visible={isAppDisabled}
        statusBarTranslucent
      >
        <View
          style={{
            backgroundColor: Colors.black90,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {startCountdown && (
            <View style={{ alignSelf: 'center', marginHorizontal: 25 }}>
              <JoloText
                kind={JoloTextKind.title}
                color={Colors.white85}
                customStyles={{ fontFamily: Fonts.Regular }}
              >
                Your wallet is disabled for security reasons
              </JoloText>
              <Space height={17} />
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 18,
                  lineHeight: 18,
                  textAlign: 'center',
                  fontFamily: Fonts.Regular,
                }}
              >
                Try again in{' '}
                <Text style={{ color: Colors.error }}>{countdown}</Text>
              </Text>
            </View>
          )}
          {isRestoreAccess && (
            <View style={{ alignSelf: 'center' }}>
              <JoloText
                kind={JoloTextKind.title}
                color={Colors.white85}
                customStyles={{
                  marginHorizontal: 25,
                  fontFamily: Fonts.Regular,
                }}
              >
                You have reached the limit of your attempts
              </JoloText>
            </View>
          )}
          {isRestoreAccess && (
            <AbsoluteBottom>
              <ScreenContainer.Padding>
                <BtnGroup>
                  <Btn onPress={handleAccessRestore} type={BtnTypes.primary}>
                    Restore Access
                  </Btn>
                  <Space height={12} />
                  <JoloText
                    size={JoloTextSizes.tiniest}
                    customStyles={{ color: Colors.white70 }}
                  >
                    Setting a new passcode will not affect your stored data
                  </JoloText>
                </BtnGroup>
              </ScreenContainer.Padding>
            </AbsoluteBottom>
          )}
        </View>
      </Modal>
    </>
  )
}

Passcode.Input = PasscodeInput
Passcode.Header = PasscodeHeader
Passcode.Forgot = PasscodeForgot
Passcode.Keyboard = PasscodeKeyboard
Passcode.Container = PasscodeContainer

export default Passcode
