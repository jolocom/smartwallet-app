import React from 'react'
import { StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { useCard } from './context'
import { CARD_HORIZONTAL_PADDING } from './CardStyledComponents'
import { Highlight } from './Field'

const CardHighlight: React.FC = () => {
  const { highlight } = useCard()
  if (!highlight) return null
  return (
    <View style={styles.highlight} testID="card-highlight">
      <Highlight>{highlight}</Highlight>
    </View>
  )
}

const styles = StyleSheet.create({
  highlight: {
    width: '100%',
    position: 'absolute',
    bottom: -1,
    alignSelf: 'center',
    paddingTop: BP({ default: 17, xsmall: 10 }),
    paddingBottom: BP({ default: 12, xsmall: 5 }),
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    backgroundColor: Colors.black,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 13,
    zIndex: 0,
  },
})

export default CardHighlight
