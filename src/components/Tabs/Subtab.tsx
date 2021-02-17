import React from 'react'
import JoloText from '~/components/JoloText'

import { ITab } from './types'
import { useTabs } from './context'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { TouchableOpacity, View } from 'react-native'
import BP from '~/utils/breakpoints'

const RIGHT_MARGIN = 15

const Subtab: React.FC<ITab> = ({ tab }) => {
  const { activeSubtab, setActiveSubtab } = useTabs()
  const isTabActive = tab.id === activeSubtab?.id
  return (
    <TouchableOpacity onPress={() => setActiveSubtab(tab)}>
      <JoloText
        size={JoloTextSizes.mini}
        color={isTabActive ? Colors.ceriseRed : Colors.white}
        customStyles={{
          lineHeight: BP({ default: 20, xsmall: 16 }),
          letterSpacing: 0.1,
          paddingHorizontal: 10,
          paddingBottom: 10,
          marginRight: RIGHT_MARGIN,
        }}
      >
        {tab.value}
      </JoloText>
      <View
        style={{
          marginRight: RIGHT_MARGIN,
          borderBottomWidth: 3,
          borderBottomColor: isTabActive ? Colors.ceriseRed : 'transparent',
        }}
      />
    </TouchableOpacity>
  )
}

export default Subtab
