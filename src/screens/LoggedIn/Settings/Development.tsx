import React, { useState } from 'react'
import { View } from 'react-native'

import Section from './components/Section'
import Option from './components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'

const DevelopmentSection = () => {
  const handleToggle = (toggled: boolean) => {
    console.log({ toggled })
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
