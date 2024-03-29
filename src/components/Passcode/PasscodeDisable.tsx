import { useEffect } from 'react'
import useTranslation from '~/hooks/useTranslation'
import { ALL_PIN_ATTEMPTS, usePasscode } from './context'
import { useDisableApp, useGetResetStoredCountdownValues } from './hooks'
import { useToasts } from '~/hooks/toasts'

const PasscodeDisable = () => {
  const { t } = useTranslation()
  const { pinError, pinSuccess, setPinErrorText } = usePasscode()
  const { pinAttemptsLeft } = useDisableApp(pinError, pinSuccess)
  const resetCountdownValues = useGetResetStoredCountdownValues()

  const { scheduleErrorWarning } = useToasts()

  /**
   * clearing app stored value
   * upon successful submission of the pass code;
   * we don't want to reset values when the hardware
   * back button is pressed (this is another way how
   * the screen can be unmounted)
   */
  useEffect(
    () => () => {
      if (pinSuccess) {
        resetCountdownValues().catch(scheduleErrorWarning)
      }
    },
    [pinSuccess],
  )

  useEffect(() => {
    const attemptsLeft = ALL_PIN_ATTEMPTS - pinAttemptsLeft || 1
    if (pinError) {
      setPinErrorText(
        t('Lock.errorMsg', {
          attempts: `${attemptsLeft}∕${ALL_PIN_ATTEMPTS}`,
          escapeValue: false,
        }),
      )
    }
  }, [pinAttemptsLeft, pinError])

  return null
}

export default PasscodeDisable
