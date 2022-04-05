import React, { useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import { BiometryType } from 'react-native-biometrics'

import ToggleSwitch from '~/components/ToggleSwitch'
import { useBiometry } from '~/hooks/biometry'
import { useDisableLock } from '~/hooks/generic'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import Option from './components/Option'

const EnableBiometryOption = () => {
  const { t } = useTranslation()
  /* State to define of this component is displayed: depends on if any biometrics were enrolled */
  const [isOptionVisible, setIsOptionVisible] = useState(false)
  /* On state that is controlled and passed to ToggleSwitch */
  const [isOn, setIsOn] = useState(false)
  /* State represent what biometrics were enrolled */
  const [enrolledBiometry, setEnrolledBiometry] = useState<
    BiometryType | undefined
  >(undefined)

  const {
    resetBiometry,
    getBiometry,
    setBiometry,
    authenticate,
    getEnrolledBiometry,
  } = useBiometry()
  const { scheduleErrorWarning } = useToasts()
  const disableLock = useDisableLock()

  /* check if we should display this component or not */
  const checkIfBiometryIsEnrolled = async () => {
    try {
      // identified biometrics will only return something if biometry was enrolled
      const { available, biometryType } = await getEnrolledBiometry()
      if (available) {
        setEnrolledBiometry(biometryType)
        setIsOptionVisible(true)
      } else {
        setIsOptionVisible(false)
      }
    } catch (e) {
      setIsOptionVisible(false)
    }
  }

  useEffect(() => {
    checkIfBiometryIsEnrolled().catch(scheduleErrorWarning)
    getStoredBiometry().catch(scheduleErrorWarning)
  }, [])

  /* check what has been stored biometry related in settings */
  const getStoredBiometry = useCallback(async () => {
    try {
      const biometry = await getBiometry()
      setIsOn(!!biometry?.type)
    } catch (e) {
      setIsOptionVisible(false)
    }
  }, [])

  const handleToggle = async () => {
    try {
      if (!isOn) {
        /* if next state is on */

        // if user wants to activate biometry
        setIsOn(true)
        const result = await disableLock(() => authenticate(enrolledBiometry))
        if (result.success) {
          enrolledBiometry && setBiometry(enrolledBiometry)
        } else {
          setIsOn((prevState) => !prevState)
        }
      } else {
        /* if next state is off */

        // if user wants to switch biometry off
        // - reset biometry value from storage as Lock screen should use this value
        setIsOn(false)
        await resetBiometry()
      }
    } catch (e) {
      setIsOn((prevState) => !prevState)
      scheduleErrorWarning(e)
    }
  }

  if (!isOptionVisible) return null
  return (
    <Option>
      <Option.Title
        title={t('Settings.biometricsBlock')}
        customStyles={{ marginRight: 60 }}
      />
      <View style={{ position: 'absolute', right: 16 }}>
        <ToggleSwitch on={isOn} onToggle={() => handleToggle} />
      </View>
    </Option>
  )
}

export default EnableBiometryOption
