import React from 'react'
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'

type PillProps = {
  seedKey: string
  onSelectKey: (key: string) => void
}

const Pill: React.FC<PillProps> = ({ seedKey, onSelectKey }) => {
  return (
    <TouchableOpacity
      style={styles.pill}
      onPress={() => onSelectKey(seedKey)}
      testID="suggestion-pill"
    >
      <Paragraph size={ParagraphSizes.medium}>{seedKey}</Paragraph>
    </TouchableOpacity>
  )
}

type SuggestionsProps = {
  suggestedKeys: string[]
  onSelectKey: (key: string) => void
}

const Suggestions: React.FC<SuggestionsProps> = ({
  suggestedKeys,
  onSelectKey,
}) => {
  return (
    <FlatList
      data={suggestedKeys}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <Pill key={item} seedKey={item} onSelectKey={onSelectKey} />
      )}
      horizontal={true}
      keyboardShouldPersistTaps="always"
      testID="suggestions-list"
    />
  )
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: 'black',
    borderRadius: 4,
    paddingHorizontal: 17,
    paddingTop: 13,
    marginRight: 8,
  },
})

export default Suggestions
