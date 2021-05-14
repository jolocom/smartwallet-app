import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native'
import { IOption, SelectableProvider, useSelectableState } from './Selectable'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'

export enum Emojis {
  Shit = '💩',
  Kiss = '😘',
  Facepalm = '🤦‍♀',
  Devil = '👿',
}

const EMOJI_SIZE = 66
const SELECTABLE_OPTIONS = Object.entries(Emojis).map(([key, value]) => ({
  id: key,
  value,
}))

const EmojiSelectable = () => {
  const { selectedValue, onSelect, setSelectedValue } = useSelectableState()

  const handleSelect = (option: IOption<string | number>) => {
    setSelectedValue(option)
    onSelect(option)
  }

  return (
    <View style={styles.container}>
      {SELECTABLE_OPTIONS.map((option) => {
        const isSelected = option.id === selectedValue?.id
        const selectionStyle =
          selectedValue &&
          (isSelected ? styles.selectedEmoji : styles.unselectedEmoji)

        return (
          <TouchableHighlight
            key={option.id}
            onPress={() => handleSelect(option)}
            style={[styles.emojiContainer, selectionStyle]}
          >
            <Text style={styles.emoji}>{option.value}</Text>
          </TouchableHighlight>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  emojiContainer: {
    width: EMOJI_SIZE,
    height: EMOJI_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: EMOJI_SIZE / 2,
    borderWidth: 1.1,
    borderColor: Colors.zincDust,
    backgroundColor: Colors.black50,
  },
  emoji: {
    fontSize: Platform.select({
      ios: BP({
        xsmall: 28,
        small: 28,
        default: 31,
      }),
      android: 23,
    }),
  },
  selectedEmoji: {
    borderColor: Colors.mainPink,
  },
  unselectedEmoji: {
    opacity: 0.5,
  },
})

export default ({
  onSelect = () => {},
}: {
  onSelect?: (val: IOption<string>) => void
}) => {
  return (
    <SelectableProvider<Emojis>
      options={SELECTABLE_OPTIONS}
      onSelect={onSelect}
    >
      <EmojiSelectable />
    </SelectableProvider>
  )
}
