import React, { useEffect, useRef, useState } from 'react'
import { useAgent } from '~/hooks/sdk'
import Section from './components/Section'
import Option from './components/Option'
import { Alert, View } from 'react-native'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import { ScreenshotManager } from '~/utils/screenshots'

const EnableScreenshotsOption = () => {
  const { t } = useTranslation()
  const agent = useAgent()
  const [isEnabled, setEnabled] = useState(false)
  const { scheduleErrorWarning } = useToasts()
  const screenshotManager = useRef(new ScreenshotManager(agent)).current

  useEffect(() => {
    screenshotManager
      .getDisabledStatus()
      .then((isDisabled) => {
        setEnabled(isDisabled)
      })
      .catch(scheduleErrorWarning)
  }, [])

  const disableScreenshots = () => {
    setEnabled(false)
    screenshotManager
      .storeDisabledStatus(true)
      .then(() => {
        ScreenshotManager.disable()
      })
      .catch((e) => {
        setEnabled(true)
        scheduleErrorWarning(e)
      })
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
            screenshotManager
              .storeDisabledStatus(false)
              .then(() => {
                ScreenshotManager.enable()
              })
              .catch((e) => {
                setEnabled(false)
                scheduleErrorWarning(e)
              })
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
