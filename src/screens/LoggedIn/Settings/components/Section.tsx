import React from 'react'
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native'
import { IWithCustomStyle } from '~/types/props'
import BP from '~/utils/breakpoints'
import Block from '~/components/Block'
import ScreenContainer from '~/components/ScreenContainer'

interface CompoundSection {
  Title: React.FC<TitleProps>
  Block: React.FC<IWithCustomStyle>
}

interface TitleProps extends IWithCustomStyle<TextStyle> {
  marginTop?: number | string
}

const SectionTitle: React.FC<TitleProps> = ({ children, customStyles }) => (
  <ScreenContainer.Header
    customStyles={[
      {
        marginBottom: BP({ large: 32, medium: 32, default: 24 }),
        customStyles,
      },
    ]}
  >
    {children}
  </ScreenContainer.Header>
)

const SectionBlock: React.FC = ({ children, ...props }) => {
  return <Block {...props}>{children}</Block>
}

const Section: React.FC<IWithCustomStyle> & CompoundSection = ({
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
