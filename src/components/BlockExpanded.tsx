import React, { useState } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  LayoutAnimation,
  StyleSheet,
} from 'react-native'

import Block from './Block'
import JoloText from './JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

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
    <Block customStyle={{ marginBottom: 16 }}>
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
            <JoloText
              size={JoloTextSizes.mini}
              customStyles={{ marginTop: 12, textAlign: 'left' }}
            >
              {expandedText}
            </JoloText>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 24,
    alignItems: 'flex-start',
  },
})

export default BlockExpanded
