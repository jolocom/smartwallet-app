import React from 'react'
import JoloText from '~/components/JoloText'

import { ITabProps, useTabs } from './Tabs'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { TouchableOpacity, View } from 'react-native'
import BP from '~/utils/breakpoints'

const RIGHT_MARGIN = 15

const Subtab: React.FC<ITabProps> = ({ children }) => {
  const { activeSubtab, setActiveSubtab } = useTabs()
  const tabName = children
  const isTabActive = tabName === activeSubtab
  return (
    <TouchableOpacity onPress={() => setActiveSubtab(children)}>
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
        {tabName}
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
