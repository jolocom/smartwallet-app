import React, { useState } from 'react'
import { View } from 'react-native'

import Section from './components/Section'
import Option from './components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'

const DevelopmentSection = () => {
  const [toggled, setToggled] = useState(false)
  const handleToggle = () => {
    setToggled(!toggled)
  }

  return (
    <Section title={'Development'}>
      <Option onPress={handleToggle}>
        <Option.Title title={'Toggle Switch'} />
        <View style={{ position: 'absolute', right: 16 }}>
          <ToggleSwitch toggled={toggled} onToggle={handleToggle} />
        </View>
      </Option>
    </Section>
  )
}

export default DevelopmentSection
