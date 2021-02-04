import React, { useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import Biometry, { BiometryType } from 'react-native-biometrics'
import { useDispatch } from 'react-redux'

import ToggleSwitch from '~/components/ToggleSwitch'
import { useBiometry } from '~/hooks/biometry'
import { useToasts } from '~/hooks/toasts'
import { setPopup } from '~/modules/appState/actions'
import { strings } from '~/translations/strings'
import Option from './components/Option'

const EnableBiometryOption = () => {
  /* State to define of this component is displayed: depends on if any biometrics were enrolled */
  const [isOptionVisible, setIsOptionVisible] = useState(false)
  /* On state that is controlled and passed to ToggleSwitch */
  const [isOn, setIsOn] = useState(false)
  /* State represent what biometrics were enrolled */
  const [enrolledBiometry, setEnrolledBiometry] = useState<
    BiometryType | undefined
    >(undefined)
  
  const dispatch = useDispatch();

  const {
    resetBiometry,
    getBiometry,
    setBiometry,
    authenticate,
    getEnrolledBiometry
  } = useBiometry()
  const { scheduleWarning } = useToasts()

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
    checkIfBiometryIsEnrolled()
    getStoredBiometry()
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
    dispatch(setPopup(true));
    try {
      if (!isOn) {
        /* if next state is on */

        // if user wants to activate biometry
        setIsOn(true)
        const result = await authenticate(enrolledBiometry)
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
      scheduleWarning({
        title: strings.WHOOPS,
        message: isOn ? strings.COULDNOT_DEACTIVATE : strings.COULDNOT_ACTIVATE,
      })
    } finally {
      dispatch(setPopup(false))
    }
  }

  if (!isOptionVisible) return null
  return (
    <Option>
      <Option.Title title={strings.USE_BIOMETRICS_TO_LOGIN} />
      <View style={{ position: 'absolute', right: 16 }}>
        <ToggleSwitch on={isOn} onToggle={handleToggle} />
      </View>
    </Option>
  )
}

export default EnableBiometryOption
