import React, { useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useAgent } from '~/hooks/sdk'
import { strings } from '~/translations/strings'
import Option from './components/Option'

const EnableBiometryOption = () => {
  const [isOn, setIsOn] = useState(false)
  const [isBiometrySelected, setIsBiometrySelected] = useState(false)
  const agent = useAgent()

  const getStoredBiometry = useCallback(async () => {
    const biometry = await agent.storage.get.setting('biometry')
    console.log({ biometry })

    if (biometry?.type) {
      handleToggle(true)
    }
  }, [])

  useEffect(() => {
    getStoredBiometry()
  }, [])

  const handleToggle = async (state: boolean) => {
    await agent.storage.store.setting('biometry', {
      type: 'Face ID',
    })
  }

  return (
    <Option>
      <Option.Title title={strings.USE_BIOMETRICS_TO_LOGIN} />
      <View style={{ position: 'absolute', right: 16 }}>
        <ToggleSwitch
          initialState={isBiometrySelected}
          onToggle={handleToggle}
        />
      </View>
    </Option>
  )
}

export default EnableBiometryOption
