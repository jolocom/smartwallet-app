import React from 'react'
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'

import { Colors } from '~/utils/colors'
import { ScaledView } from '../ScaledCard'

interface Props {
  onPress: () => void
  positionStyles: Partial<Pick<ViewStyle, 'left' | 'right' | 'top' | 'bottom'>>
}

export const CardMoreBtn: React.FC<Props> = ({ onPress, positionStyles }) => {
  return (
    <ScaledView
      scaleStyle={[styles.dotsContainerScaled, positionStyles]}
      style={styles.dotsContainer}
    >
      <TouchableOpacity onPress={onPress} style={styles.dotsBtn}>
        {[...Array(3).keys()].map((c) => (
          <ScaledView key={c} scaleStyle={styles.dot} />
        ))}
      </TouchableOpacity>
    </ScaledView>
  )
}

const styles = StyleSheet.create({
  dotsContainerScaled: {
    paddingHorizontal: 3,
  },
  dotsContainer: {
    position: 'absolute',
    zIndex: 100,
  },
  dotsBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
    backgroundColor: Colors.black,
  },
})
