import React, { useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import FingerprintScanner from 'react-native-fingerprint-scanner'
import Keychain from 'react-native-keychain'

import ToggleSwitch from '~/components/ToggleSwitch'
import { useBiometry } from '~/hooks/biometry'
import { strings } from '~/translations/strings'
import Option from './components/Option'

const EnableBiometryOption = () => {
  const [isOn, setIsOn] = useState(false)
  const [isSwitchVisible, setSwitchVisibility] = useState(false)
  const [isOptionVisible, setIsOptionVisible] = useState(false)
  const [enrolledBiometry, setEnrolledBiometry] = useState(null)
  const { resetBiometry, getBiometry, updateBiometry } = useBiometry()

  const getStoredBiometry = useCallback(async () => {
    const biometry = await getBiometry()
    setIsOn(!!biometry?.type)
    setSwitchVisibility(true)
  }, [])

  useEffect(() => {
    getStoredBiometry()
  }, [])

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

  useEffect(() => {
    checkIfBiometryIsEnrolled()
  }, [])

  const handleToggle = async () => {
    try {
      if (!isOn) {
        // if user wants to activate biometry
        await FingerprintScanner.authenticate({
          fallbackEnabled: false,
        })
        updateBiometry(enrolledBiometry)
        setIsOn(true)
      } else {
        // if user wants to switch biometry off
        // - reset biometry value from storage as Lock screen keeps us with this value
        await resetBiometry()
        setIsOn(false)
      }
    } catch (e) {
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
