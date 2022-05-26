import React, { useEffect, useMemo, useState, useRef } from 'react'

import { useFailed } from '~/hooks/loader'
import { usePopStack } from '~/hooks/navigation'

import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'
import {
  useGetSeedPhrase,
  useRecordUserHasWrittenSeedPhrase,
} from '~/hooks/sdk'
import shuffleArray from '~/utils/arrayUtils'
import Dnd from './Dnd'
import useTranslation from '~/hooks/useTranslation'
import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextWeight } from '~/components/JoloText'
import { Platform, StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'
import AbsoluteBottom from '~/components/AbsoluteBottom'

const SeedPhraseRepeat: React.FC = () => {
  const recordUserHasWrittenSeedPhrase = useRecordUserHasWrittenSeedPhrase()
  const seedPhrase = useGetSeedPhrase()
  const showFailedLoader = useFailed()
  const popStack = usePopStack()
  const { t } = useTranslation()

  const [wrongOrder, setWrongOrder] = useState(false)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const [shuffledSeedphrase, setShuffledSeedphrase] = useState<string[] | null>(
    null,
  )

  const isFirstFragment = useRef(Boolean(Math.round(Math.random())))

  const phraseArr = seedPhrase.split(' ')
  const phraseFragmentFirst = phraseArr.slice(0, 6)
  const phraseFragmentLast = phraseArr.slice(6, 12)

  const usedFragment = isFirstFragment.current
    ? phraseFragmentFirst
    : phraseFragmentLast

  useEffect(() => {
    const shuffled = shuffleArray(usedFragment)
    setShuffledSeedphrase(shuffled)
  }, [seedPhrase])

  const handlePhraseUpdate = (phrase: string[]) => {
    if (JSON.stringify(phrase) !== JSON.stringify(shuffledSeedphrase)) {
      if (!readyToSubmit) setReadyToSubmit(true)
      setWrongOrder(false)
      setShuffledSeedphrase(phrase)
    }
  }

  const onSubmit = async () => {
    if (isPhraseValid) {
      await recordUserHasWrittenSeedPhrase(popStack)
    } else {
      showFailedLoader()
      setTimeout(() => {
        setWrongOrder(true)
      }, 400)
    }
  }

  const isPhraseValid = useMemo(() => {
    if (!shuffledSeedphrase) return false

    return shuffledSeedphrase.join(' ') === usedFragment.join(' ')
  }, [JSON.stringify(shuffledSeedphrase), seedPhrase])

  return (
    <ScreenContainer
      hasHeaderBack
      navigationStyles={{
        backgroundColor: Colors.mainBlack,
      }}
      customStyles={{
        justifyContent: 'flex-start',
        backgroundColor: Colors.mainBlack,
      }}
    >
      {wrongOrder ? (
        <JoloText
          weight={JoloTextWeight.medium}
          customStyles={{ marginTop: 8, paddingHorizontal: 36 }}
          color={Colors.error}
        >
          {t('SeedphraseRepeat.matchingError')}
        </JoloText>
      ) : (
        <JoloText
          weight={JoloTextWeight.medium}
          customStyles={{ marginTop: 8, paddingHorizontal: 36 }}
        >
          {t('SeedphraseRepeat.orderInstructions')}
        </JoloText>
      )}
      <View style={styles.phraseContainer}>
        {shuffledSeedphrase && shuffledSeedphrase.length > 1 ? (
          <Dnd tags={shuffledSeedphrase} updateTags={handlePhraseUpdate} />
        ) : null}
      </View>
      <AbsoluteBottom>
        <Btn
          disabled={!readyToSubmit || wrongOrder}
          onPress={onSubmit}
          type={BtnTypes.primary}
        >
          {t('SeedphraseRepeat.confirmBtn')}
        </Btn>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}
const styles = StyleSheet.create({
  phraseContainer: {
    flex: 1,
    ...Platform.select({
      ios: {
        justifyContent: 'flex-start',
        marginTop: '40%',
      },
      android: {
        marginTop: BP({ default: 60, small: 24, xsmall: 16 }),
      },
    }),
  },
})

export default SeedPhraseRepeat
