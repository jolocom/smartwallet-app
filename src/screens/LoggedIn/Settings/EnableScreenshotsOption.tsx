import React from 'react'
import { useAgent } from '~/hooks/sdk'
import Section from './components/Section'
import Option from './components/Option'
import { Alert, View } from 'react-native'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import { ScreenshotManager } from '~/utils/screenshots'
import { getIsMakingScreenshotDisabled } from '~/modules/account/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { setMakingScreenshotDisability } from '~/modules/account/actions'

const EnableScreenshotsOption = () => {
  const { t } = useTranslation()
  const agent = useAgent()
  const dispatch = useDispatch()
  const isMakingScreenshotDisabled = useSelector(getIsMakingScreenshotDisabled)
  const { scheduleErrorWarning } = useToasts()

  const disableScreenshots = () => {
    ScreenshotManager.storeDisabledStatus(true, agent)
      .then(() => {
        ScreenshotManager.disable().catch(scheduleErrorWarning)
        dispatch(setMakingScreenshotDisability(true))
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
            ScreenshotManager.storeDisabledStatus(false, agent)
              .then(() => {
                ScreenshotManager.enable().catch(scheduleErrorWarning)
                dispatch(setMakingScreenshotDisability(false))
              })
              .catch(scheduleErrorWarning)
          },
        },
      ],
      { cancelable: true },
    )
  }

  const handleToggleMakingScreenshotDisability = () => {
    if (isMakingScreenshotDisabled) {
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
          <ToggleSwitch
            on={!isMakingScreenshotDisabled}
            onToggle={handleToggleMakingScreenshotDisability}
          />
        </View>
      </Option>
    </Section.Block>
  )
}

export default EnableScreenshotsOption
