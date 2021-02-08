import React from 'react'
import { View } from 'react-native'
import JoloText from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'

const IdentityTabsPlaceholder: React.FC<{ show: boolean }> = ({ show }) =>
  show ? (
    <View style={{ marginBottom: 24, paddingHorizontal: '10%' }}>
      <JoloText color={Colors.white50} size={JoloTextSizes.mini}>
        {strings.YOUR_INFO_IS_QUITE_EMPTY}
      </JoloText>
      <JoloText color={Colors.white50} size={JoloTextSizes.mini}>
        {strings.FILL_IT_IN_FOR_THE_FUTURE_CASES}
      </JoloText>
    </View>
  ) : null

export default IdentityTabsPlaceholder
