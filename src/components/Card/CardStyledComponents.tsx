import React from 'react'
import { StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'
import { IWithCustomStyle } from './types'

export const CARD_HORIZONTAL_PADDING = BP({ default: 20, xsmall: 16 })

export const CardContainer: React.FC = ({ children }) => (
  <View style={styles.container} children={children} />
)

export const CardBody: React.FC<IWithCustomStyle> = ({
  children,
  customStyles,
}) => <View style={[styles.bodyContainer, customStyles]} children={children} />

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  bodyContainer: {
    height: '100%',
    alignSelf: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
  },
})
