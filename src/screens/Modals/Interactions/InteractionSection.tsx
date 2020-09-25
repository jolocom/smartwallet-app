import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { FAS_PADDING } from './consts'
import BP from '~/utils/breakpoints'

interface Props {
  title: string
  visible: boolean
}

const InteractionSection: React.FC<Props> = ({ title, visible, children }) => {
  return visible ? (
    <View style={styles.sectionContainer}>
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        color={Colors.white35}
        customStyles={{ textAlign: 'left', marginLeft: FAS_PADDING }}
      >
        {title}
      </JoloText>
      {children}
    </View>
  ) : null
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: BP({ large: 36, medium: 36, small: 24, xsmall: 24 }),
  },
})

export default InteractionSection
