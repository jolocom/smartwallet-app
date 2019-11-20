import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { black, sandLight006, white } from '../../../styles/colors'

const styles = StyleSheet.create({
  emojiButton: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: white,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: sandLight006,
  },
  emoji: {
    fontSize: 23,
    color: black,
  },
})

interface Props {
  emoji: string
}

export const EmojiButton = (props: Props) => {
  // TODO add pressed style and state
  const { emoji } = props
  return (
    <TouchableOpacity style={styles.emojiButton}>
      <Text style={styles.emoji}>{emoji}</Text>
    </TouchableOpacity>
  )
}
