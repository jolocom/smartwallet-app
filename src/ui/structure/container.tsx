import * as React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { ReactNode } from 'react'
import { JolocomTheme } from 'src/styles/jolocom-theme'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: JolocomTheme.jolocom.gray4,
    height: '100%',
    width: '100%',
    padding: '5%'
  }
})

export interface Props {
  children: ReactNode;
  style?: ViewStyle;
}

export const Container : React.SFC<Props> = (props) => {
  return(
    <View style={ [styles.container, props.style] }>
      {props.children}
    </View>
  )
}
