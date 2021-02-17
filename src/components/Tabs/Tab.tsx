import React from 'react'

import { ITab } from './types'
import { useTabs } from './context'
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
