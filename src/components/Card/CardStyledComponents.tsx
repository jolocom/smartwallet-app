import React from 'react'
import { StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'

export const CARD_HORIZONTAL_PADDING = 18

export const CardContainer: React.FC = ({ children }) => (
  <View style={styles.container} children={children} />
)

export const CardBody: React.FC = ({ children }) => (
  <View style={styles.bodyContainer} children={children} />
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  bodyContainer: {
    transform: [{ scale: BP({ default: 1, xsmall: 0.9 }) }],
    height: '100%',
    alignSelf: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingTop: 22,
  },
})
