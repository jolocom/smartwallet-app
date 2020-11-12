import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'
import Block, { BlockAlign } from '~/components/Block'

interface PropsI {
  title: string
  customStyles?: ViewStyle
}

const Section: React.FC<PropsI> = ({ title, children, customStyles = {} }) => (
  <View style={[styles.sectionContainer, customStyles]}>
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      weight={JoloTextWeight.regular}
      customStyles={{
        marginBottom: BP({ large: 40, medium: 40, default: 20 }),
      }}
    >
      {title}
    </JoloText>
    {children && <Block align={BlockAlign.left}>{children}</Block>}
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
