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
  type?: NavHeaderType
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
        {
          justifyContent: 'space-between',
        },
        customStyles,
      ]}
    >
      {type === NavHeaderType.Back && (
        <IconBtn
          disabled={type !== NavHeaderType.Back}
          onPress={navigateBack}
          style={styles.button}
        >
          <BackArrowIcon />
        </IconBtn>
      )}
      <View style={styles.centerComponent}>{children}</View>
      {type === NavHeaderType.Close && (
        <IconBtn
          disabled={type !== NavHeaderType.Close}
          onPress={navigateBack}
          style={styles.button}
        >
          <CloseIcon />
        </IconBtn>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    // TODO: should be exported: used in Collapsible too
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
    paddingHorizontal: 10,
  },
})

export default NavigationHeader
