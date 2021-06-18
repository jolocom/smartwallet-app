import React from 'react'
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native'

import Block from './Block'
import JoloText from './JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import BP from '~/utils/breakpoints'
import { useToggleExpand } from '~/hooks/ui'

interface Props {
  title: string
  expandedText: string
  onExpand?: () => void
}

const BlockExpanded: React.FC<Props> = ({
  title,
  expandedText,
  onExpand = () => {},
}) => {
  const { isExpanded, onToggleExpand } = useToggleExpand({
    onExpand,
  })

  return (
    <Block
      customStyle={{
        marginBottom: BP({ default: 16, xsmall: 12 }),
      }}
    >
      <TouchableWithoutFeedback onPress={onToggleExpand}>
        <View style={styles.container}>
          <JoloText
            size={JoloTextSizes.middle}
            color={Colors.white90}
            customStyles={{ textAlign: 'left' }}
          >
            {title}
          </JoloText>
          {isExpanded && (
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
