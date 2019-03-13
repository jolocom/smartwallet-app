import React from 'react'
import { ScrollView, StyleSheet, ViewStyle } from 'react-native'
import { ReactNode } from 'react'
import { JolocomTheme } from 'src/styles/jolocom-theme'

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: JolocomTheme.primaryColorGrey,
    padding: '5%',
  },
})

interface Props {
  children: ReactNode
  style?: ViewStyle
}

export const ScrollContainer: React.SFC<Props> = props => {
  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={[styles.container, props.style]}
    >
      {props.children}
    </ScrollView>
  )
}
