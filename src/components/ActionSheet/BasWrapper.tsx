import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'

import InteractionIcon, { IconWrapper } from './InteractionIcon'
import { useSafeArea } from 'react-native-safe-area-context'

interface Props {
  customStyles?: ViewStyle
  showIcon?: boolean
}

export const BasInteractionBody: React.FC = ({ children }) => (
  <View style={styles.interactionBody}>{children}</View>
)

const BasWrapper: React.FC<Props> = ({
  children,
  customStyles = {},
  //NOTE: currently only the @IntermediarySheetBody doesn't render the counterparty icon
  showIcon = true,
}) => {
  const { bottom } = useSafeArea()
  return (
    <View style={[styles.wrapper, { bottom: bottom + 5 }]}>
      {showIcon && (
        <IconWrapper customStyle={{ marginBottom: -35 }}>
          <View style={styles.basIcon}>
            <InteractionIcon />
          </View>
        </IconWrapper>
      )}
      <View style={[styles.childrenWrapper, customStyles]}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignSelf: 'center',
    width: '98%',
  },
  basIcon: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  childrenWrapper: {
    width: '100%',
    backgroundColor: Colors.codGrey,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: BP({ large: 48, medium: 48, small: 44, xsmall: 44 }),
    paddingBottom: BP({ large: 36, medium: 36, small: 24, xsmall: 24 }),
  },
  interactionBody: {
    marginBottom: BP({ large: 50, medium: 50, small: 50, xsmall: 40 }),
    width: '100%',
    alignItems: 'center',
  },
})

export default BasWrapper
