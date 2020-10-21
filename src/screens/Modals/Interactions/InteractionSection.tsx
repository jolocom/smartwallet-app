import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
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
        weight={JoloTextWeight.regular}
        customStyles={{
          textAlign: 'left',
          marginBottom: 12,
        }}
      >
        {title}
      </JoloText>
      {children}
    </View>
  ) : null
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: BP({ large: 36, medium: 36, default: 24 }),
  },
})

export default InteractionSection
