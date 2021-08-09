import React, { memo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { Colors } from '~/utils/colors'
import { useRecoveryState } from './module/recoveryContext'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import ScreenHeader from '~/components/ScreenHeader'
import { JoloTextSizes } from '~/utils/fonts'
import BP from '~/utils/breakpoints'
import useTranslation from '~/hooks/useTranslation'

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
    const { t } = useTranslation()
    return (
      <View style={styles.header}>
        {phrase.length ? (
          <>
            <JoloText
              kind={JoloTextKind.title}
              size={JoloTextSizes.middle}
              customStyles={{ marginTop: 12 }}
            >
              {currentWordIdx === phrase.length
                ? phrase.length
                : currentWordIdx + 1}
              /12
            </JoloText>
            <View style={styles.seedPhraseContainer}>
              {phrase.map((seedKey: string, idx: number) => (
                <JoloText
                  kind={JoloTextKind.title}
                  size={JoloTextSizes.middle}
                  weight={JoloTextWeight.regular}
                  key={seedKey + idx}
                  color={
                    currentWordIdx === 12
                      ? Colors.success
                      : idx === currentWordIdx
                      ? Colors.white
                      : Colors.activity
                  }
                  customStyles={{
                    marginHorizontal: 3,
                    ...Platform.select({
                      ios: {
                        lineHeight: BP({
                          default: 26,
                          xsmall: 22,
                        }),
                      },
                    }),
                  }}
                >
                  {seedKey}
                </JoloText>
              ))}
            </View>
          </>
        ) : (
          <View
            style={{
              ...Platform.select({
                android: {
                  paddingBottom: BP({
                    default: 79,
                    xsmall: 44,
                  }),
                },
              }),
              marginTop: 12,
            }}
          >
            <ScreenHeader
              title={t('Recovery.header')}
              subtitle={t('Recovery.subheader')}
            />
          </View>
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
    ...Platform.select({
      android: {
        height: BP({ default: 137, xsmall: 97 }),
      },
    }),
  },
})

export default function () {
  const { phrase, currentWordIdx } = useRecoveryState()

  return <RecoveryHeader phrase={phrase} currentWordIdx={currentWordIdx} />
}
