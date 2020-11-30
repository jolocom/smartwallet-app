import React from 'react'
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'
import Block from '~/components/Block'

interface PropsI {
  title: string
  customStyles?: ViewStyle
  titleStyles?: TextStyle
  hasBlock?: boolean
}

const Section: React.FC<PropsI> = ({
  title,
  children,
  hasBlock = true,
  customStyles = {},
  titleStyles = {},
}) => {
  const ChildrenContainer = hasBlock ? Block : React.Fragment

  return (
    <View
      style={[
        styles.sectionContainer,
        { marginBottom: children ? 44 : 0 },
        customStyles,
      ]}
    >
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        weight={JoloTextWeight.regular}
        customStyles={[
          {
            textAlign: 'left',
            marginBottom: children
              ? BP({ large: 40, medium: 40, default: 20 })
              : 0,
          },
          titleStyles,
        ]}
      >
        {title}
      </JoloText>
      {children && <ChildrenContainer>{children}</ChildrenContainer>}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: 'flex-start',
    marginBottom: 44,
    alignItems: 'flex-start',
    width: '100%',
  },
})

export default Section
