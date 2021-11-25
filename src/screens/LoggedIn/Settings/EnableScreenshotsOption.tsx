import React, { useEffect, useState } from 'react'
import { StorageKeys, useAgent } from '~/hooks/sdk'
// @ts-ignore
import FlagSecure from 'react-native-flag-secure-android'
import Section from './components/Section'
import Option from './components/Option'
import { Alert, View } from 'react-native'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'

//TODO: disable screenshots on the Seedphrase screen
const EnableScreenshotsOption = () => {
  const { t } = useTranslation()
  const agent = useAgent()
  const [isEnabled, setEnabled] = useState(false)
  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    agent.storage.get
      .setting(StorageKeys.screenshotsEnabled)
      .then((value) => {
        const { isEnabled } = value
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

  const enableScreenshots = () => {
    Alert.alert(
      t('Settings.screenshotAlertTitle'),
      t('Settings.screenshotAlertMsg'),
      [
        { text: t('Settings.screenshotAlertCancel') },
        {
          text: t('Settings.screenshotAlertCta'),
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
        <Option.Title title={t('Settings.screenshotBlock')} />
        <View style={{ position: 'absolute', right: 16 }}>
          <ToggleSwitch on={isEnabled} onToggle={handleDisableScreenshots} />
        </View>
      </Option>
    </Section.Block>
  )
}

export default EnableScreenshotsOption
