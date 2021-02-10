import React, { useRef } from 'react'
import { View } from 'react-native'

import Section from '../components/Section'
import Option from '../components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import { useRedirect, useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import useErrors from '~/hooks/useErrors'
import { SWErrorCodes } from '~/errors/codes'
import PopupMenu from '~/components/PopupMenu'

const DevelopmentSection = () => {
  const { scheduleInfo } = useToasts()
  const { showErrorDisplay } = useErrors()
  const redirectToNotifications = useRedirectTo(ScreenNames.NotificationsTest)
  const redirectToInputs = useRedirectTo(ScreenNames.InputTest)
  const redirectToPasscode = useRedirectTo(ScreenNames.PasscodeTest)
  const redirectToBusinessCard = useRedirectTo(ScreenNames.BusinessCardTest)
  const redirect = useRedirect()

  const popupRef = useRef<{ show: () => void }>(null)

  const handleToggle = (toggled: boolean) => {
    scheduleInfo({
      title: 'ToggleSwitch',
      message: `I am ${toggled ? 'toggled' : 'not toggled'}!`,
    })
  }

  return (
    <Section>
      <Section.Title>Development</Section.Title>
      <Section.Block>
        <Option>
          <Option.Title title="Toggle Switch" />
          <View style={{ position: 'absolute', right: 16 }}>
            <ToggleSwitch onToggle={handleToggle} />
          </View>
        </Option>
        <Option onPress={() => redirect(ScreenNames.ButtonsTest)}>
          <Option.Title title="Buttons" />
        </Option>
        <Option onPress={() => redirect(ScreenNames.LoaderTest)}>
          <Option.Title title="Loader" />
        </Option>
        <Option
          onPress={() => showErrorDisplay(new Error(SWErrorCodes.SWUnknown))}
        >
          <Option.Title title="Throw error" />
        </Option>
        <Option onPress={() => popupRef.current?.show()}>
          <Option.Title title="Popup menu" />
          <PopupMenu
            ref={popupRef}
            options={[
              { title: 'Help', onPress: () => {} },
              { title: 'Me', onPress: () => {} },
              { title: 'Please', onPress: () => {} },
            ]}
          />
        </Option>
        <Option onPress={redirectToNotifications}>
          <Option.Title title="Notifications" />
        </Option>
        <Option onPress={redirectToInputs}>
          <Option.Title title="Inputs" />
        </Option>
        <Option onPress={redirectToPasscode}>
          <Option.Title title="Passcode" />
        </Option>
        <Option onPress={redirectToBusinessCard}>
          <Option.Title title="Business Card" />
        </Option>
      </Section.Block>
    </Section>
  )
}

export default DevelopmentSection
