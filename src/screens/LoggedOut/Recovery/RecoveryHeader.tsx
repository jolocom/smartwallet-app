import React from 'react'
import { StyleSheet, View } from 'react-native'

import Header, { HeaderSizes } from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'

interface RecoveryHeaderPropsI {
  phrase: string[]
  currentWordIdx: number
}

const RecoveryHeader: React.FC<RecoveryHeaderPropsI> = ({
  phrase,
  currentWordIdx,
}) => {
  return (
    <View style={styles.header}>
      {phrase.length ? (
        <>
          <Header>
            {currentWordIdx === phrase.length
              ? phrase.length
              : currentWordIdx + 1}
            /12
          </Header>
          <View style={styles.seedPhraseContainer}>
            {phrase.map((seedKey: string, idx: number) => (
              <Header
                key={seedKey + idx}
                size={HeaderSizes.small}
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
              </Header>
            ))}
          </View>
        </>
      ) : (
        <>
          <Header>{strings.RECOVERY}</Header>
          <Paragraph>{strings.START_ENTERING_SEED_PHRASE}</Paragraph>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    width: '100%',
    height: 150,
  },
  seedPhraseContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
})

export default RecoveryHeader
