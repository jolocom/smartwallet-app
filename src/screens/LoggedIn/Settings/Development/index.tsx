import React, { useState, useRef } from 'react'
import { View } from 'react-native'

import Section from '../components/Section'
import Option from '../components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import PopupMenu from '~/components/PopupMenu'

const DevelopmentSection = () => {
  const { scheduleInfo } = useToasts()
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
          <ToggleSwitch initialState={false} onToggle={handleToggle} />
        </View>
      </Option>
      <Option onPress={redirectButtons}>
        <Option.Title title="Buttons" />
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
    </Section>
  )
}

export default DevelopmentSection
