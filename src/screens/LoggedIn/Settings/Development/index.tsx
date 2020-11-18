import React from 'react'
import { View } from 'react-native'

import Section from '../components/Section'
import Option from '../components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'

const DevelopmentSection = () => {
  const { scheduleInfo } = useToasts()
  const redirectButtons = useRedirectTo(ScreenNames.ButtonsTest)

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
    </Section>
  )
}

export default DevelopmentSection
