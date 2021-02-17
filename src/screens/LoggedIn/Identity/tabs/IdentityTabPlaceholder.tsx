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
    <View style={{ marginBottom: 24, paddingHorizontal: '10%', }}>
      <JoloText color={Colors.white50} size={JoloTextSizes.mini}>
        {children}
      </JoloText>
    </View>
  ) : null

export default IdentityTabsPlaceholder
