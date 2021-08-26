import { useIsFocused } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { usePrevious } from '~/hooks/generic'
import { useRedirect } from '~/hooks/navigation'
import { SettingKeys, useSettings } from '~/hooks/settings'
import { ScreenNames } from '~/types/screens'
import { ALL_PIN_ATTEMPTS } from './context'

export const PIN_ATTEMPTS_CYCLES = 3

export const useGetStoreCountdownValues = () => {
  const { settings } = useSettings()
  const getPinNrAttemptsLeft = async (): Promise<
    { value: number } | undefined
  > => settings.get(SettingKeys.pinNrAttemptsLeft)
  const storePinNrAttemptsLeft = async (value: number) =>
    settings.set(SettingKeys.pinNrAttemptsLeft, { value })

  const getPinNrAttemptCyclesLeft = async (): Promise<
    { value: number } | undefined
  > => settings.get(SettingKeys.pinNrAttemptCyclesLeft)
  const storePinNrAttemptCyclesLeft = async (value: number) =>
    settings.set(SettingKeys.pinNrAttemptCyclesLeft, { value })

  const getLastCountdown = async (): Promise<{ value: number } | undefined> =>
    settings.get(SettingKeys.countdown)
  const storeLastCountdown = async (value: number) =>
    settings.set(SettingKeys.countdown, { value })

  return {
    getPinNrAttemptsLeft,
    storePinNrAttemptsLeft,
    getPinNrAttemptCyclesLeft,
    storePinNrAttemptCyclesLeft,
    getLastCountdown,
    storeLastCountdown,
  }
}

export const useDisableApp = (pinError: boolean, pinSuccess: boolean) => {
  const [isAppDisabled, setIsAppDisabled] = useState(false)

  const [countdown, setCountdown] = useState<number | undefined>(undefined)

  const [pinAttemptsLeft, setPinAttemptsLeft] = useState(ALL_PIN_ATTEMPTS)

  const [attemptCyclesLeft, setAttemptCyclesLeft] =
    useState<number | undefined>(undefined)

  const {
    getPinNrAttemptsLeft,
    storePinNrAttemptsLeft,
    getPinNrAttemptCyclesLeft,
    storePinNrAttemptCyclesLeft,
    getLastCountdown,
    storeLastCountdown,
  } = useGetStoreCountdownValues()

  /**
   * reset stored value back to initial PIN_ATTEMPTS_CYCLES nr
   * TODO: remove after full implementation
   */
  // useEffect(() => {
  //   ;(async () => {
  //     await storePinNrAttemptCyclesLeft(PIN_ATTEMPTS_CYCLES)
  //   })()
  // }, [])

  /**
   * reset all stored value after
   * successful submission of the pass code
   */

  const redirect = useRedirect()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setPinAttemptsLeft(ALL_PIN_ATTEMPTS)
      if (attemptCyclesLeft === 0) {
        disableApp()
      }
      setCountdown(0)
    }
  }, [isFocused, attemptCyclesLeft])

  /**
   * fetch nr of attempt cycles available for the user
   */
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

  /**
   * fetch nr of attempts within a cycle available for the user
   */
  useEffect(() => {
    ;(async () => {
      try {
        const response = await getPinNrAttemptsLeft()
        if (response?.value !== undefined) {
          setPinAttemptsLeft(response.value)
        } else {
          // initialize nr of pin attempt cycles left
          await storePinNrAttemptsLeft(ALL_PIN_ATTEMPTS)
          setPinAttemptsLeft(ALL_PIN_ATTEMPTS)
        }
      } catch (e) {
        console.log('Error retrieving or storing nr of pin attempt cycles left')
      }
    })()
  }, [])

  /**
   * fetch uncompleted countdown
   */
  useEffect(() => {
    ;(async () => {
      try {
        const response = await getLastCountdown()
        if (response?.value !== undefined) {
          setCountdown(response.value)
        } else {
          await storeLastCountdown(0)
          setCountdown(0)
        }
      } catch (e) {
        console.log('Error retrieving or storing countdown')
      }
    })()
  }, [])

  /**
   * check if we have stored countdown value
   * and disable the app if its value is not
   * equal to zero, meaning countdown has completed
   */
  useEffect(() => {
    if (countdown !== undefined) {
      if (countdown !== 0) {
        setIsAppDisabled(true)
      }
    }
  }, [countdown])

  /**
   * count amount of wrong pins provided
   */
  useEffect(() => {
    if (pinError) {
      setPinAttemptsLeft((prev) => --prev)
    }
  }, [pinError])

  /**
   * store pinAttemptsLeft value when it diminishes
   */
  const prevPinAttempts = usePrevious(pinAttemptsLeft)
  useEffect(() => {
    if (pinAttemptsLeft !== undefined && prevPinAttempts !== undefined) {
      ;(async () => {
        await storePinNrAttemptsLeft(pinAttemptsLeft)
      })()
    }
  }, [pinAttemptsLeft])

  /**
   * store attemptCyclesLeft value when it diminishes
   */
  const prevAttemptCycle = usePrevious(attemptCyclesLeft)
  useEffect(() => {
    if (
      attemptCyclesLeft !== undefined &&
      prevAttemptCycle !== undefined &&
      attemptCyclesLeft < prevAttemptCycle
    ) {
      setIsAppDisabled(true)
    }
  }, [attemptCyclesLeft])

  /**
   *  disable the app when no passcode input attempts are left
   */
  useEffect(() => {
    if (pinAttemptsLeft === 0) {
      ;(async () => {
        if (attemptCyclesLeft !== undefined) {
          await storePinNrAttemptCyclesLeft(attemptCyclesLeft - 1)
          setAttemptCyclesLeft((prev) => prev! - 1)
        }
      })()
    }
  }, [pinAttemptsLeft])

  useEffect(() => {
    if (isAppDisabled && isFocused) {
      disableApp()
    } else if (!isFocused) {
      setIsAppDisabled(false)
    }
  }, [isAppDisabled, isFocused])

  const disableApp = useCallback(() => {
    redirect(ScreenNames.GlobalModals, {
      screen: ScreenNames.AppDisabled,
      params: { attemptCyclesLeft, countdown },
    })
  }, [attemptCyclesLeft, countdown])

  return {
    pinAttemptsLeft,
  }
}
