import React from 'react'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'

import { ITab, useTabs } from './Tabs'
import { Colors } from '~/utils/colors'
import { TouchableOpacity } from 'react-native'
import ScreenContainer from '../ScreenContainer'

const Tab: React.FC<ITab> = ({ tab }) => {
  const { activeTab, setActiveTab } = useTabs()
  const isTabActive = tab.id === activeTab?.id
  return (
    <TouchableOpacity onPress={() => setActiveTab(tab)}>
      <ScreenContainer.Header
        color={isTabActive ? Colors.white85 : Colors.white35}
        customStyles={{ marginRight: 20 }}
      >
        {tab.value}
      </ScreenContainer.Header>
    </TouchableOpacity>
  )
}

export default Tab
