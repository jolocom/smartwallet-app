import React, { useState } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  LayoutAnimation,
  StyleSheet,
} from 'react-native'

import Block from './Block'
import JoloText from './JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import BP from '~/utils/breakpoints'

interface Props {
  title: string
  expandedText: string
}

const BlockExpanded: React.FC<Props> = ({ title, expandedText }) => {
  const [showText, setShowText] = useState(false)

  const handleExpand = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 200,
    })
    setShowText((prev) => !prev)
  }

  return (
    <Block
      customStyle={{
        marginBottom: BP({ default: 16, xsmall: 12 }),
      }}
    >
      <TouchableWithoutFeedback onPress={handleExpand}>
        <View style={styles.container}>
          <JoloText
            size={JoloTextSizes.middle}
            color={Colors.white90}
            customStyles={{ textAlign: 'left' }}
          >
            {title}
          </JoloText>
          {showText && (
            <View>
              <JoloText
                size={JoloTextSizes.mini}
                customStyles={{
                  marginTop: BP({ default: 12, xsmall: 12 }),
                  textAlign: 'left',
                }}
              >
                {expandedText}
              </JoloText>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: BP({ default: 24, xsmall: 20 }),
    paddingHorizontal: BP({ default: 24, xsmall: 16 }),
    alignItems: 'flex-start',
  },
})

export default BlockExpanded
