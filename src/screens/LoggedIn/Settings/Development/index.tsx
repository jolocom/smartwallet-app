import React, { useState, useRef } from 'react'
import { View } from 'react-native'

import Section from '../components/Section'
import Option from '../components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import PopupMenu from '~/components/PopupMenu'
import CardDetails from '../../Documents/CardDetails'

const DevelopmentSection = () => {
  const { scheduleInfo } = useToasts()
  const redirectButtons = useRedirectTo(ScreenNames.ButtonsTest)
  const popupRef = useRef<{ show: () => void }>(null)
  const cardDetailsRef = useRef<{ show: () => void }>(null)

  const handleToggle = (toggled: boolean) => {
    scheduleInfo({
      title: 'ToggleSwitch',
      message: `I am ${toggled ? 'toggled' : 'not toggled'}!`,
    })
  }

  const docCardMockData = {
    'Name of issuer': 'Embassy of Netherlands',
    'First name': 'De Bruijn',
    'Last name': 'Willeke Liselotte',
    'Valid from': '09 MAA/MAR 2024',
    'Gender ': 'Female',
    '2 Last name': 'Willeke Liselotte',
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
      <Option onPress={() => cardDetailsRef.current?.show()}>
        <Option.Title title="Document details" />
        <CardDetails
          ref={cardDetailsRef}
          fields={docCardMockData}
          title={'Nederlandse identitekaart'}
          image="https://images.squarespace-cdn.com/content/v1/58b6d9ebe3df28b4704a432a/1510938300368-IMGDBVK4VWVMLUB33ZOQ/ke17ZwdGBToddI8pDm48kHHhnm_e4vzfA2TZSKVMHRIUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8PaoYXhp6HxIwZIk7-Mi3Tsic-L2IOPH3Dwrhl-Ne3Z2fzX2QyLZ_hq8bX3s34fVPvKH1q7Ud9ntNbhCpmtfHIqkL3r1G49e-3ZnDLNRdB_t/_MG_9627.jpg"
        />
      </Option>
    </Section>
  )
}

export default DevelopmentSection
