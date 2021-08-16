import React, { useEffect, useState } from 'react'
import { StorageKeys, useAgent } from '~/hooks/sdk'
// @ts-ignore
import FlagSecure from 'react-native-flag-secure-android'
import Section from './components/Section'
import Option from './components/Option'
import { Platform, View } from 'react-native'
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
    FlagSecure.activate()
    agent.storage.store
      .setting(StorageKeys.screenshotsEnabled, {
        isEnabled: false,
      })
      .catch(scheduleErrorWarning)
  }

  const enableScreenshots = () => {
    FlagSecure.deactivate()
    agent.storage.store
      .setting(StorageKeys.screenshotsEnabled, {
        isEnabled: true,
      })
      .catch(scheduleErrorWarning)
  }

  const handleDisableScreenshots = () => {
    setEnabled((prev) => {
      prev ? disableScreenshots() : enableScreenshots()
      return !prev
    })
  }

  return Platform.OS === 'android' ? (
    <Section>
      <Section.Title>Privacy</Section.Title>
      <Section.Block>
        <Option>
          <Option.Title title="Enabled screenshots" />
          <View style={{ position: 'absolute', right: 16 }}>
            <ToggleSwitch on={isEnabled} onToggle={handleDisableScreenshots} />
          </View>
        </Option>
      </Section.Block>
    </Section>
  ) : null
}

export default EnableScreenshotsOption
