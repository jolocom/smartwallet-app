import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

import { ArrowHeadDown, ArrowHeadRight } from '~/assets/svg'
import { useToggleExpand } from '~/hooks/ui'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import Block from './Block'
import JoloText from './JoloText'

interface Props {
  title: string
  expandedText: string
  onExpand?: () => void
  hasDropdown?: boolean
}

const BlockExpanded: React.FC<Props> = ({
  title,
  expandedText,
  onExpand = () => {},
  hasDropdown = false,
}) => {
  const { isExpanded, onToggleExpand } = useToggleExpand({
    onExpand,
  })

  return (
    <Block
      customStyles={{
        marginBottom: BP({ default: 16, xsmall: 12 }),
      }}
    >
      <TouchableWithoutFeedback
        testID="blockExpandedButton"
        onPress={onToggleExpand}
      >
        <View style={styles.container}>
          <View style={styles.titleWrapper}>
            <JoloText
              testID="title"
              size={JoloTextSizes.middle}
              color={Colors.white90}
              customStyles={{
                textAlign: 'left',
                maxWidth: hasDropdown ? '90%' : '100%',
              }}
            >
              {title}
            </JoloText>
            {hasDropdown && isExpanded && <ArrowHeadDown />}
            {hasDropdown && !isExpanded && <ArrowHeadRight />}
          </View>
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
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
})

export default BlockExpanded
