import React from 'react'
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native'

import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'
import Block from '~/components/Block'
import ScreenContainer from '~/components/ScreenContainer'

interface CompoundSection {
  Title: React.FC<TitleProps>
  Block: React.FC
}

interface TitleProps {
  marginTop?: number | string
  customStyle?: TextStyle
}

const SectionTitle: React.FC<TitleProps> = ({ children, customStyle }) => (
  <ScreenContainer.Header
    customStyles={[
      {
        marginBottom: BP({ large: 32, medium: 32, default: 24 }),
        ...customStyle,
      },
    ]}
  >
    {children}
  </ScreenContainer.Header>
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
    marginBottom: 44,
  },
})

Section.Title = SectionTitle
Section.Block = SectionBlock

export default Section
