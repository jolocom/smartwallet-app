import React, { useEffect, useState } from 'react'
import { StorageKeys, useAgent } from '~/hooks/sdk'
// @ts-ignore
import FlagSecure from 'react-native-flag-secure-android'
import Section from './components/Section'
import Option from './components/Option'
import { Alert, Platform, View } from 'react-native'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'

//TODO: disable screenshots on the Seedphrase screen
const EnableScreenshotsOption = () => {
  const agent = useAgent()
  const [isEnabled, setEnabled] = useState(false)
  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    //TODO: this has to happen somewhere during wallet init, and dispatch the value to redux
    agent.storage.get
      .setting(StorageKeys.screenshotsEnabled)
      .then((value) => {
        const { isEnabled } = value
        console.log({ isEnabled })
        isEnabled ? enableScreenshots() : disableScreenshots()
        setEnabled(!!isEnabled)
      })
      .catch(scheduleErrorWarning)
  }, [])

  const disableScreenshots = () => {
    setEnabled(false)
    FlagSecure.activate()
    agent.storage.store
      .setting(StorageKeys.screenshotsEnabled, {
        isEnabled: false,
      })
      .catch(scheduleErrorWarning)
  }

  // TODO add terms
  const enableScreenshots = () => {
    Alert.alert(
      'Pay attention',
      'All content will be visible when switching between apps running in the background',
      [
        { text: 'Cancel' },
        {
          text: 'Turn on',
          onPress: () => {
            setEnabled(true)
            FlagSecure.deactivate()
            agent.storage.store
              .setting(StorageKeys.screenshotsEnabled, {
                isEnabled: true,
              })
              .catch(scheduleErrorWarning)
          },
        },
      ],
      { cancelable: true },
    )
  }

  const handleDisableScreenshots = () => {
    if (isEnabled) {
      disableScreenshots()
    } else {
      enableScreenshots()
    }
  }

  return (
    <Section.Block>
      <Option>
        <Option.Title title="Allow screenshots" />
        <View style={{ position: 'absolute', right: 16 }}>
          <ToggleSwitch on={isEnabled} onToggle={handleDisableScreenshots} />
        </View>
      </Option>
    </Section.Block>
  )
}

export default EnableScreenshotsOption
