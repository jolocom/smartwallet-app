import React, { memo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'
import { useRecoveryState } from './module/recoveryContext'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenHeader from '~/components/ScreenHeader'

interface RecoveryHeaderI {
  phrase: string[]
  currentWordIdx: number
}

const arePropsEqual = (
  prevProps: RecoveryHeaderI,
  nextProps: RecoveryHeaderI,
) => {
  if (prevProps.currentWordIdx !== nextProps.currentWordIdx) {
    return false
  }
  if (prevProps.phrase.toString() != nextProps.phrase.toString()) {
    return false
  }
  return true
}

const RecoveryHeader: React.FC<RecoveryHeaderI> = memo(
  ({ phrase, currentWordIdx }) => {
    return (
      <View style={styles.header}>
        {phrase.length ? (
          <>
            <JoloText kind={JoloTextKind.title} size="middle">
              {currentWordIdx === phrase.length
                ? phrase.length
                : currentWordIdx + 1}
              /12
            </JoloText>
            <View style={styles.seedPhraseContainer}>
              {phrase.map((seedKey: string, idx: number) => (
                <JoloText
                  kind={JoloTextKind.title}
                  size="middle"
                  key={seedKey + idx}
                  color={
                    currentWordIdx === 12
                      ? Colors.success
                      : idx === currentWordIdx
                      ? Colors.white
                      : Colors.activity
                  }
                  customStyles={{ marginHorizontal: 3 }}
                >
                  {seedKey}
                </JoloText>
              ))}
            </View>
          </>
        ) : (
          <ScreenHeader
            title={strings.RECOVERY}
            subtitle={strings.START_ENTERING_SEED_PHRASE}
          />
        )}
      </View>
    )
  },
  arePropsEqual,
)

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    width: '100%',
  },
  seedPhraseContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
})

export default function () {
  const { phrase, currentWordIdx } = useRecoveryState()

  return <RecoveryHeader phrase={phrase} currentWordIdx={currentWordIdx} />
}
