import React, { useRef, useState } from 'react'
import { View } from 'react-native'

import Section from '../components/Section'
import Option from '../components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import useErrors from '~/hooks/useErrors'
import { SWErrorCodes } from '~/errors/codes'
import PopupMenu from '~/components/PopupMenu'
import TopSheet from '~/components/TopSheet'
import Btn, { BtnTypes } from '~/components/Btn'

const DevelopmentSection = () => {
  const { scheduleInfo } = useToasts()
  const { showErrorDisplay } = useErrors()
  const redirectToButtons = useRedirectTo(ScreenNames.ButtonsTest)
  const redirectToNotifications = useRedirectTo(ScreenNames.NotificationsTest)
  const redirectToForms = useRedirectTo(ScreenNames.FormTest)
  const redirectToInputs = useRedirectTo(ScreenNames.InputTest)
  const [showTopSheet, setShowTopSheet] = useState(false)
  const redirectButtons = useRedirectTo(ScreenNames.ButtonsTest)
  const popupRef = useRef<{ show: () => void }>(null)

  const handleToggle = (toggled: boolean) => {
    scheduleInfo({
      title: 'ToggleSwitch',
      message: `I am ${toggled ? 'toggled' : 'not toggled'}!`,
    })
  }

  return (
    <Section title="Development">
      <Option>
        <Option.Title title="Toggle Switch" />
        <View style={{ position: 'absolute', right: 16 }}>
          <ToggleSwitch onToggle={handleToggle} />
        </View>
      </Option>
      <Option onPress={redirectToButtons}>
        <Option.Title title="Buttons" />
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
      <Option onPress={redirectToForms}>
        <Option.Title title="Forms" />
      </Option>
      <Option onPress={redirectToInputs}>
        <Option.Title title="Inputs" />
      </Option>
      <Option onPress={() => popupRef.current?.show()}>
        <Option.Title title="Top ActionSheet" />
        <TopSheet
          onClose={() => setShowTopSheet(false)}
          isVisible={showTopSheet}
        >
          <Btn onPress={() => setShowTopSheet(false)} type={BtnTypes.senary}>
            Test
          </Btn>
        </TopSheet>
        <View style={{ position: 'absolute', right: 16 }}>
          <ToggleSwitch
            on={showTopSheet}
            onToggle={() => setShowTopSheet((prev) => !prev)}
          />
        </View>
      </Option>
    </Section>
  )
}

export default DevelopmentSection
