import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'

type PillProps = {
  seedKey: string
  onSelectKey: (key: string) => void
}

const Pill: React.FC<PillProps> = ({ seedKey, onSelectKey }) => {
  return (
    <TouchableOpacity style={styles.pill} onPress={() => onSelectKey(seedKey)}>
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
      style={styles.suggestionsContainer}
      data={suggestedKeys}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <Pill key={item} seedKey={item} onSelectKey={onSelectKey} />
      )}
      horizontal={true}
      keyboardShouldPersistTaps="always"
    />
  )
}

const styles = StyleSheet.create({
  suggestionsContainer: {
    marginBottom: 8,
  },
  pill: {
    backgroundColor: 'black',
    borderRadius: 4,
    paddingHorizontal: 17,
    paddingVertical: 10,
    marginRight: 8,
  },
})

export default Suggestions
