import React from 'react'
import { View, StyleSheet } from 'react-native'

import CloseIcon from '~/assets/svg/CloseIcon'
import { useGoBack } from '~/hooks/navigation'
import IconBtn from './IconBtn'
import { BackArrowIcon } from '~/assets/svg'
import { IWithCustomStyle } from '~/types/props'

export enum NavHeaderType {
  Back = 'back',
  Close = 'close',
}

interface Props extends IWithCustomStyle {
  type: NavHeaderType
  onPress?: () => void
}

const NavigationHeader: React.FC<Props> = ({
  type,
  onPress,
  customStyles,
  children,
}) => {
  const navigateBack = onPress ?? useGoBack()

  return (
    <View
      style={[
        styles.navContainer,
        customStyles,
        {
          justifyContent: 'space-between',
        },
      ]}
    >
      <View style={{ opacity: type === NavHeaderType.Back ? 1 : 0 }}>
        <IconBtn
          disabled={type !== NavHeaderType.Back}
          onPress={navigateBack}
          style={styles.button}
        >
          <BackArrowIcon />
        </IconBtn>
      </View>
      <View style={styles.centerComponent}>{children}</View>
      <View style={{ opacity: type === NavHeaderType.Close ? 1 : 0 }}>
        <IconBtn
          disabled={type !== NavHeaderType.Close}
          onPress={navigateBack}
          style={styles.button}
        >
          <CloseIcon />
        </IconBtn>
      </View>
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
  centerComponent: {
    flex: 1,
    paddingHorizontal: 30,
  },
})

export default NavigationHeader
