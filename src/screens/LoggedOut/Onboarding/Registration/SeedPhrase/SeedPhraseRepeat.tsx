import React, { useEffect, useMemo, useState, useRef } from 'react'

import { useFailed } from '~/hooks/loader'
import { BackArrowIcon } from '~/assets/svg'
import {
  useDangerouslyDisableGestures,
  useGoBack,
  usePopStack,
} from '~/hooks/navigation'

import SeedPhrase from './components/Styled'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'
import {
  useGetMnemonicPhrase,
  useRecordUserHasWrittenSeedPhrase,
} from '~/hooks/sdk'
import shuffleArray from '~/utils/arrayUtils'
import Dnd from './Dnd'
import useTranslation from '~/hooks/useTranslation'

const SeedPhraseRepeat: React.FC = () => {
  const goBack = useGoBack()
  const recordUserHasWrittenSeedPhrase = useRecordUserHasWrittenSeedPhrase()
  const mnemonicPhrase = useGetMnemonicPhrase()
  const showFailedLoader = useFailed()
  const popStack = usePopStack()
  const { t } = useTranslation()

  useDangerouslyDisableGestures()

  const [wrongOrder, setWrongOrder] = useState(false)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const [shuffledSeedphrase, setShuffledSeedphrase] =
    useState<string[] | null>(null)

  const isFirstFragment = useRef(Boolean(Math.round(Math.random())))

  const phraseArr = mnemonicPhrase.split(' ')
  const phraseFragmentFirst = phraseArr.slice(0, 6)
  const phraseFragmentLast = phraseArr.slice(6, 12)

  const usedFragment = isFirstFragment.current
    ? phraseFragmentFirst
    : phraseFragmentLast

  useEffect(() => {
    const shuffled = shuffleArray(usedFragment)
    setShuffledSeedphrase(shuffled)
  }, [mnemonicPhrase])

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
  }, [JSON.stringify(shuffledSeedphrase), mnemonicPhrase])

  return (
    <SeedPhrase.Styled.ScreenContainer bgColor={Colors.mainBlack}>
      <SeedPhrase.Styled.Header>
        <SeedPhrase.Styled.Header.Left onPress={goBack}>
          <BackArrowIcon />
        </SeedPhrase.Styled.Header.Left>
      </SeedPhrase.Styled.Header>
      {wrongOrder ? (
        <SeedPhrase.Styled.ErrorText>
          {t('SeedphraseRepeat.matchingError')}
        </SeedPhrase.Styled.ErrorText>
      ) : (
        <SeedPhrase.Styled.HelperText>
          {t('SeedphraseRepeat.orderInstructions')}
        </SeedPhrase.Styled.HelperText>
      )}
      <SeedPhrase.Styled.ActiveArea>
        {shuffledSeedphrase && shuffledSeedphrase.length > 1 ? (
          <Dnd tags={shuffledSeedphrase} updateTags={handlePhraseUpdate} />
        ) : null}
      </SeedPhrase.Styled.ActiveArea>
      <SeedPhrase.Styled.CTA>
        <Btn
          disabled={!readyToSubmit || wrongOrder}
          onPress={onSubmit}
          type={BtnTypes.primary}
        >
          {t('SeedphraseRepeat.confirmBtn')}
        </Btn>
      </SeedPhrase.Styled.CTA>
    </SeedPhrase.Styled.ScreenContainer>
  )
}

export default SeedPhraseRepeat
