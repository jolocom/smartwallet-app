import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { ReactNode } from 'react'

const styles = StyleSheet.create({
  block: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  debug: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
})

interface Props {
  children: ReactNode
  flex?: number
  debug?: boolean
  style?: ViewStyle | ViewStyle[]
  onTouch?: () => void
}

export const Block: React.SFC<Props> = props => {
  const customStyle = Array.isArray(props.style) ? props.style : [props.style]
  const style = [styles.block, ...customStyle]
  if (props.debug) {
    style.push(styles.debug)
  }

  if (props.flex) {
    style.push({ flex: props.flex })
  }

  return (
    <View onTouchEnd={props.onTouch} style={style}>
      {props.children}
    </View>
  )
}
