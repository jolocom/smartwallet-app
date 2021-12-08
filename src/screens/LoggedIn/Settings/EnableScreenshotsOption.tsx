import React, { useEffect, useState } from 'react'
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
  const [isDisabled, setDisabled] = useState(true)
  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    ScreenshotManager.getDisabledStatus(agent)
      .then(setDisabled)
      .catch(scheduleErrorWarning)
  }, [])

  const disableScreenshots = () => {
    setDisabled(true)
    ScreenshotManager.storeDisabledStatus(true, agent)
      .then(() => {
        ScreenshotManager.disable()
      })
      .catch((e) => {
        setDisabled(false)
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
            setDisabled(false)
            ScreenshotManager.storeDisabledStatus(false, agent)
              .then(() => {
                ScreenshotManager.enable()
              })
              .catch((e) => {
                setDisabled(true)
                scheduleErrorWarning(e)
              })
          },
        },
      ],
      { cancelable: true },
    )
  }

  const handleDisableScreenshots = () => {
    if (isDisabled) {
      enableScreenshots()
    } else {
      disableScreenshots()
    }
  }

  return (
    <Section.Block>
      <Option>
        <Option.Title title={t('Settings.screenshotBlock')} />
        <View style={{ position: 'absolute', right: 16 }}>
          <ToggleSwitch on={!isDisabled} onToggle={handleDisableScreenshots} />
        </View>
      </Option>
    </Section.Block>
  )
}

export default EnableScreenshotsOption
