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

const PIN_ATTEMPTS = 3
const INITIAL_COUNTDOWN = 60 * 1

const useDisabledApp = (pinError: boolean) => {
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
  const [pinAttempts, setPinAttempts] = useState(PIN_ATTEMPTS)

  // count amount of wrong pins provided
  useEffect(() => {
    if (pinError) {
      setPinAttempts((prev) => --prev)
    }
  }, [pinError])

  // disable the app when no attempt are left
  useEffect(() => {
    if (pinAttempts === 0) {
      setIsAppDisabled(true)
    }
  }, [pinAttempts])

  // countdown
  useEffect(() => {
    let countdownId: number | undefined
    if (startCountdown) {
      countdownId = setInterval(() => {
        setCountdown((prev) => --prev)
      }, 1000)
    }
    return () => {
      if (countdownId) {
        clearInterval(countdownId)
      }
    }
  }, [startCountdown])

  // enable app when the countdown expired
  useEffect(() => {
    if (countdown === 0) {
      // TODO: check if this is not the last attempt cycle
      setIsAppDisabled(false)
    }
  }, [countdown])

  /**
   * start countdown when the app is disabled
   * reset countdown when the app is enabled
   */
  useEffect(() => {
    if (isAppDisabled) {
      setStartCountdown(true)
    } else {
      /**
       * TODO: Nr of minutes will vary
       * based on an attempt cycle
       */
      setCountdown(INITIAL_COUNTDOWN)
      setStartCountdown(false)
      setPinAttempts(PIN_ATTEMPTS)
    }
  }, [isAppDisabled])

  return { isAppDisabled, pinAttempts, countdown }
}

const Passcode: React.FC<IPasscodeProps> & IPasscodeComposition = ({
  children,
  onSubmit,
}) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinSuccess, setPinSuccess] = useState(false)

  const { isAppDisabled, pinAttempts, countdown } = useDisabledApp(pinError)

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
         * NOTE at this point pinAttempts is still an old value,
         * therefore we compare with 1 not 0
         */
        if (pinAttempts > 1) {
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

  return (
    <>
      <PasscodeContext.Provider value={contextValue} children={children} />
      <Modal
        animationType="none"
        transparent
        visible={isAppDisabled}
        statusBarTranslucent
      >
        <View
          style={{
            backgroundColor: Colors.black80,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: Colors.white }}>{countdown}</Text>
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
