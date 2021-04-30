import React from 'react'
import { View } from 'react-native'
import JoloText from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

const IdentityTabsPlaceholder: React.FC<{ show: boolean }> = ({
  show,
  children,
}) =>
  show ? (
    <View>
      <JoloText
        color={Colors.white50}
        size={JoloTextSizes.mini}
        customStyles={{ textAlign: 'left' }}
      >
        {children}
      </JoloText>
    </View>
  ) : null

export default IdentityTabsPlaceholder
