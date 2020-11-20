import React from 'react'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'

import { ITabProps, useTabs } from './Tabs'
import { Colors } from '~/utils/colors'
import { TouchableOpacity } from 'react-native'

const Tab: React.FC<ITabProps> = ({ children }) => {
  const { activeTab, setActiveTab } = useTabs()
  const tabName = children
  const isTabActive = tabName === activeTab
  return (
    <TouchableOpacity onPress={() => setActiveTab(children)}>
      <JoloText
        kind={JoloTextKind.title}
        weight={JoloTextWeight.regular}
        color={isTabActive ? Colors.white85 : Colors.white35}
        customStyles={{ marginRight: 20 }}
      >
        {tabName}
      </JoloText>
    </TouchableOpacity>
  )
}

export default Tab
