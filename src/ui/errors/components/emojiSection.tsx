import { Text, View } from 'react-native'
import { styles } from '../styles'
import React from 'react'

interface Props {
  selectedEmoji: Emoji
  setEmoji: (emoji: Emoji) => void
}

export enum Emoji {
  Empty = '',
  Shit = '💩',
  Kiss = '😘',
  Facepalm = '🤦‍♀',
  Devil = '👿',
}

export const EmojiSection = (props: Props) => {
  const { selectedEmoji, setEmoji } = props
  const emojiList = [Emoji.Shit, Emoji.Kiss, Emoji.Facepalm, Emoji.Devil]
  return (
    <React.Fragment>
      <View style={styles.emojiWrapper}>
        {emojiList.map(emoji => (
          <EmojiButton
            onPress={() => setEmoji(emoji)}
            selected={selectedEmoji}
            emoji={emoji}
          />
        ))}
      </View>
    </React.Fragment>
  )
}

interface ButtonProps {
  emoji: Emoji
  selected: Emoji
  onPress: () => void
}

const EmojiButton = (props: ButtonProps) => {
  const { emoji, selected, onPress } = props
  const isSelected = selected === emoji
  const defaultState = selected === ''

  return (
    <View
      style={{
        ...styles.emojiButton,
        ...(!defaultState &&
          (isSelected ? styles.selectedEmoji : styles.unselectedEmoji)),
      }}
      onTouchEnd={onPress}
    >
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  )
}
