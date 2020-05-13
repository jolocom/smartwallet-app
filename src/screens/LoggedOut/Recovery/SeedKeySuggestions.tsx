import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { useRecoveryState, useRecoveryDispatch } from './module/context'
import { submitKey } from './module/actions'

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

const SeedKeySuggestions: React.FC = () => {
  const { suggestedKeys } = useRecoveryState()
  const dispatch = useRecoveryDispatch()

  const handleKeySelect = (key: string) => {
    dispatch(submitKey(key))
  }
  return (
    <FlatList
      data={suggestedKeys}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <Pill key={item} seedKey={item} onSelectKey={handleKeySelect} />
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

export default SeedKeySuggestions
