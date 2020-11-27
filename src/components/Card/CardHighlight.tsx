import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { useCard } from './Card'
import { CARD_HORIZONTAL_PADDING } from './CardStyledComponents'
import { Highlight } from './Field'

const CardHighlight: React.FC = () => {
  const { highlight } = useCard()
  if (!highlight) return null
  return (
    <View style={styles.highlight}>
      <Highlight>{highlight}</Highlight>
    </View>
  )
}

const styles = StyleSheet.create({
  highlight: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    paddingTop: 17,
    paddingBottom: 12,
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    backgroundColor: Colors.black,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 14,
    zIndex: 0,
  },
})

export default CardHighlight
