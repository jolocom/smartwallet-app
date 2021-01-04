import React from 'react'
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'
import Block from '~/components/Block'

interface TitleProps {
  text: string
  customStyles?: TextStyle
}

const SectionTitle: React.FC<TitleProps> = ({ text, customStyles = {} }) => (
  <JoloText
    kind={JoloTextKind.title}
    size={JoloTextSizes.middle}
    weight={JoloTextWeight.regular}
    customStyles={[
      {
        textAlign: 'left',
        marginBottom: BP({ large: 40, medium: 40, default: 20 }),
        marginTop: 44,
      },
      customStyles,
    ]}
  >
    {text}
  </JoloText>
)

interface PropsI {
  title: string
  customStyles?: ViewStyle
  titleStyles?: TextStyle
  hasBlock?: boolean
}

const Section: React.FC<PropsI> & { Title: React.FC<TitleProps> } = ({
  children,
  title,
  hasBlock = true,
  customStyles = {},
}) => {
  const ChildrenContainer = hasBlock ? Block : React.Fragment

  return (
    <View style={[styles.sectionContainer, customStyles]}>
      <Section.Title text={title} />
      <ChildrenContainer>{children}</ChildrenContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
})

Section.Title = SectionTitle

export default Section
