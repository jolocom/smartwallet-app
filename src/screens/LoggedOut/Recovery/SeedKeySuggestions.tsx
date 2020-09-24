import React, { memo } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native'

import { useRecoveryState, useRecoveryDispatch } from './module/recoveryContext'
import { submitKey } from './module/recoveryActions'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

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
      <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.big}>
        {seedKey}
      </JoloText>
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
    backgroundColor: Colors.black,
    borderRadius: 4,
    paddingTop: Platform.select({
      ios: 4,
      android: BP({
        large: 0,
        medium: 0,
        small: 4,
        xsmall: 4,
      }),
    }),
    paddingHorizontal: 17,
    justifyContent: 'center',
    height: 44,
    marginRight: 8,
  },
})

export default function () {
  const { suggestedKeys } = useRecoveryState()

  return <SeedKeySuggestions suggestedKeys={suggestedKeys} />
}
