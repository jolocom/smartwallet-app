import React from 'react'
import { StyleSheet, View } from 'react-native'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'
import Block, { BlockAlign } from '~/components/Block'

interface PropsI {
  title: string
}

const Section: React.FC<PropsI> = ({ title, children }) => (
  <View style={styles.sectionContainer}>
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      weight={JoloTextWeight.regular}
    >
      {title}
    </JoloText>
    {children && (
      <Block
        align={BlockAlign.left}
        customStyle={{
          marginTop: BP({ large: 40, medium: 40, default: 20 }),
        }}
      >
        {children}
      </Block>
    )}
  </View>
)

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: 'flex-start',
    marginBottom: 44,
    alignItems: 'flex-start',
    width: '100%',
  },
})

export default Section
