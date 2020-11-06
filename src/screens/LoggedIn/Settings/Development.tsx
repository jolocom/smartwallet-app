import React from 'react'
import { View } from 'react-native'

import Section from './components/Section'
import Option from './components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'

const DevelopmentSection = () => {
  const { scheduleInfo } = useToasts()

  const handleToggle = (toggled: boolean) => {
    scheduleInfo({
      title: 'ToggleSwitch',
      message: `I am ${toggled ? 'toggled' : 'not toggled'}!`,
    })
  }

  return (
    <Section title={'Development'}>
      <Option>
        <Option.Title title={'Toggle Switch'} />
        <View style={{ position: 'absolute', right: 16 }}>
          <ToggleSwitch initialState={false} onToggle={handleToggle} />
        </View>
      </Option>
    </Section>
  )
}

export default DevelopmentSection
