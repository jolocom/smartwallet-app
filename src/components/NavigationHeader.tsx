import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

import { BackArrowIcon } from '~/assets/svg'
import CloseIcon from '~/assets/svg/CloseIcon'
import { useGoBack } from '~/hooks/navigation'
import { IWithCustomStyle } from '~/types/props'
import IconBtn from './IconBtn'

export enum NavHeaderType {
  Back = 'back',
  Close = 'close',
}

interface Props extends IWithCustomStyle, ViewProps {
  type?: NavHeaderType
  onPress?: () => void
}

const NavigationHeader: React.FC<Props> = ({
  type,
  onPress,
  customStyles,
  children,
  ...rest
}) => {
  // FIXME: This is really bad and has to be fixed. We're doing this
  // because we're using the NavigationHeader in the ErrorReporting component,
  // which is outside the navigation provider.
  const goBack = onPress ?? useGoBack()

  const navigateBack = () => {
    goBack()
  }

  return (
    <View
      style={[
        styles.navContainer,
        {
          justifyContent: 'space-between',
        },
        customStyles,
      ]}
      {...rest}
    >
      {type === NavHeaderType.Back && (
        <IconBtn
          testID="backArrow"
          disabled={type !== NavHeaderType.Back}
          onPress={navigateBack}
          customStyles={styles.button}
        >
          <BackArrowIcon />
        </IconBtn>
      )}
      <View testID="heading" style={styles.centerComponent}>
        {children}
      </View>
      {type === NavHeaderType.Close && (
        <IconBtn
          testID="closeIcon"
          disabled={type !== NavHeaderType.Close}
          onPress={navigateBack}
          customStyles={styles.button}
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
