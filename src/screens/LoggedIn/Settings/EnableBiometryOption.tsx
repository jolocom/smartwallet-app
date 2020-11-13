import React, { useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import FingerprintScanner, {
  Biometrics,
} from 'react-native-fingerprint-scanner'
import Biometry from 'react-native-biometrics'

import ToggleSwitch from '~/components/ToggleSwitch'
import { useBiometry } from '~/hooks/biometry'
import { useToasts } from '~/hooks/toasts'
import { strings } from '~/translations/strings'
import Option from './components/Option'

const EnableBiometryOption = () => {
  /* State to define of this component is displayed: depends on if any biometrics were enrolled */
  const [isOptionVisible, setIsOptionVisible] = useState(false)
  /* On state that is controlled and passed to ToggleSwitch */
  const [isOn, setIsOn] = useState(false)
  /* Based on this state we display switch or not to handle correct was on child useRef */
  const [isSwitchVisible, setSwitchVisibility] = useState(false)
  /* State represent what biometrics were enrolled */
  const [enrolledBiometry, setEnrolledBiometry] = useState<Biometrics | null>(
    null,
  )

  const { resetBiometry, getBiometry, updateBiometry } = useBiometry()
  const { scheduleWarning } = useToasts()

  const checkIfBiometryIsEnrolled = async () => {
    try {
      // identified biometrics will only return something if biometry was enrolled
      const identifiedBiometrics = await FingerprintScanner.isSensorAvailable()
      setEnrolledBiometry(identifiedBiometrics)
      setIsOptionVisible(true)
    } catch (e) {
      setIsOptionVisible(false)
    }
  }

  /* check if we should display this component or not */
  useEffect(() => {
    checkIfBiometryIsEnrolled()
  }, [])

  /* check what has been stored biometry related in settings */
  const getStoredBiometry = useCallback(async () => {
    const biometry = await getBiometry()
    setIsOn(!!biometry?.type)
    setSwitchVisibility(true)
  }, [])

  useEffect(() => {
    getStoredBiometry()
  }, [])

  const handleToggle = async () => {
    try {
      if (!isOn) {
        /* if next state is on */

        // if user wants to activate biometry
        setIsOn(true)
        await Biometry.simplePrompt({
          promptMessage: 'Authenticate',
        })
        enrolledBiometry && updateBiometry(enrolledBiometry)
      } else {
        /* if next state is off */

        // if user wants to switch biometry off
        // - reset biometry value from storage as Lock screen should use this value
        await resetBiometry()
        setIsOn(false)
      }
    } catch (e) {
      scheduleWarning({
        title: 'Ooops',
        message: isOn
          ? 'We could not disactivate biometrics'
          : 'We could not activate biometrics',
      })
      console.log('error in biometry option', { e })
    }
  }

  if (!isOptionVisible) return null
  return (
    <Option>
      <Option.Title title={strings.USE_BIOMETRICS_TO_LOGIN} />
      <View style={{ position: 'absolute', right: 16 }}>
        {isSwitchVisible ? (
          <ToggleSwitch on={isOn} onToggle={handleToggle} />
        ) : null}
      </View>
    </Option>
  )
}

export default EnableBiometryOption
