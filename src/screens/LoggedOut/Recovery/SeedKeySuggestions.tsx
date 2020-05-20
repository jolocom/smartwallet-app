import React, { memo } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { useRecoveryState, useRecoveryDispatch } from './module/recoveryContext'
import { submitKey } from './module/recoveryActions'

type PillProps = {
  seedKey: string
  onSelectKey: (key: string) => void
}

interface SeedKeySuggestionsI {
  suggestedKeys: string[]
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

const areEqual = (
  prevProps: SeedKeySuggestionsI,
  nextProps: SeedKeySuggestionsI,
) => {
  if (
    prevProps.suggestedKeys.toString() !== nextProps.suggestedKeys.toString()
  ) {
    return false
  }
  return true
}

const SeedKeySuggestions: React.FC<SeedKeySuggestionsI> = memo(
  ({ suggestedKeys }) => {
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
  },
  areEqual,
)

const styles = StyleSheet.create({
  pill: {
    backgroundColor: 'black',
    borderRadius: 4,
    paddingHorizontal: 17,
    paddingTop: 13,
    marginRight: 8,
  },
})

export default function () {
  const { suggestedKeys } = useRecoveryState()

  return <SeedKeySuggestions suggestedKeys={suggestedKeys} />
}
