import React from 'react'
import { View, StyleSheet } from 'react-native'

import CloseIcon from '~/assets/svg/CloseIcon'
import { useGoBack } from '~/hooks/navigation'
import IconBtn from './IconBtn'
import { BackArrowIcon } from '~/assets/svg'
import { IWithCustomStyle } from './Card/types'
import { useSafeArea } from 'react-native-safe-area-context'

export enum NavHeaderType {
  Back = 'back',
  Close = 'close',
}

interface Props extends IWithCustomStyle {
  type: NavHeaderType
  onPress?: () => void
}

const NavigationHeader: React.FC<Props> = ({ type, onPress, customStyles }) => {
  const navigateBack = onPress ?? useGoBack();
  const { top } = useSafeArea();

  return (
    <View
      style={[
        styles.navContainer,
        (top ? { paddingTop: top } : {}),
        customStyles,
        {
          justifyContent:
            type === NavHeaderType.Close ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <IconBtn onPress={navigateBack} style={styles.button}>
        {type === NavHeaderType.Back ? <BackArrowIcon /> : <CloseIcon />}
      </IconBtn>
    </View>
  )
}

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  button: {
    width: 40,
    height: 40,
  },
})

export default NavigationHeader
