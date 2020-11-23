import React, { useState } from 'react'
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
  const [showPopup, setShowPopup] = useState(false)

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
      <Option onPress={() => setShowPopup(true)}>
        <Option.Title title="Popup menu" />
        <PopupMenu
          options={[
            { title: 'Help', onPress: () => {} },
            { title: 'Me', onPress: () => {} },
            { title: 'Please', onPress: () => {} },
          ]}
          onClose={() => setShowPopup(false)}
          isVisible={showPopup}
        />
      </Option>
    </Section>
  )
}

export default DevelopmentSection
