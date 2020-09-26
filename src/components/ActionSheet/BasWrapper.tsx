import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors } from '~/utils/colors'
import InteractionIcon, { IconWrapper } from './InteractionIcon'

interface Props {
  style?: ViewStyle
  showIcon?: boolean
}

const BasWrapper: React.FC<Props> = ({
  children,
  style = {},
  showIcon = true,
}) => {
  return (
    <View style={styles.wrapper}>
      {showIcon && (
        <IconWrapper customStyle={{ marginBottom: -35 }}>
          <View style={styles.basIcon}>
            <InteractionIcon />
          </View>
        </IconWrapper>
      )}
      <View style={[styles.childrenWrapper, style]}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 5,
    bottom: 5,
  },
  childrenWrapper: {
    width: '100%',
    backgroundColor: Colors.lightBlack,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
    alignItems: 'center',
  },
  basIcon: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
})

export default BasWrapper
