import React from 'react'
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native'

import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'
import Block from '~/components/Block'

interface CompoundSection {
  Title: React.FC<TitleProps>
  Block: React.FC
}

interface TitleProps {
  marginTop?: number | string
  customStyle?: TextStyle
}

const SectionTitle: React.FC<TitleProps> = ({
  children,
  marginTop = 0,
  customStyle,
}) => (
  <JoloText
    kind={JoloTextKind.title}
    size={JoloTextSizes.middle}
    weight={JoloTextWeight.regular}
    customStyles={[
      {
        alignSelf: 'flex-start',
        textAlign: 'left',
        marginBottom: BP({ large: 32, medium: 32, default: 24 }),
        marginTop,
        ...customStyle,
      },
    ]}
  >
    {children}
  </JoloText>
)

const SectionBlock: React.FC = ({ children }) => {
  return <Block>{children}</Block>
}

const Section: React.FC<{ customStyles?: ViewStyle }> & CompoundSection = ({
  children,
  customStyles = {},
}) => {
  return <View style={[styles.sectionContainer, customStyles]}>{children}</View>
}

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 44,
  },
})

Section.Title = SectionTitle
Section.Block = SectionBlock

export default Section
