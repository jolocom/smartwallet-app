import React from 'react'
import { StyleSheet, Text, TouchableHighlight } from 'react-native'
import { black, black050, borderGrey, joloColor } from '../../../styles/colors'

const styles = StyleSheet.create({
  emojiButton: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: borderGrey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: black050,
  },
  selectedEmoji: {
    borderColor: joloColor,
    backgroundColor: black050,
  },
  unselectedEmoji: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 23,
    color: black,
  },
})

interface Props {
  emoji: string
  selected: string
  onPress: () => void
}

export const EmojiButton = (props: Props) => {
  const { emoji, selected, onPress } = props
  const isSelected = selected === emoji
  const defaultState = selected === ''

  return (
    <TouchableHighlight
      style={{
        ...styles.emojiButton,
        ...(!defaultState &&
          (isSelected ? styles.selectedEmoji : styles.unselectedEmoji)),
      }}
      onPress={onPress}
    >
      <Text style={styles.emoji}>{emoji}</Text>
    </TouchableHighlight>
  )
}
