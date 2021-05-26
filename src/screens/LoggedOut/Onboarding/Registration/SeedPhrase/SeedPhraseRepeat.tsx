import React, { useEffect, useMemo, useState, useRef } from 'react'

import { useFailed } from '~/hooks/loader'
import { useSubmitIdentity } from '~/hooks/sdk'
import { BackArrowIcon } from '~/assets/svg'
import { useGoBack } from '~/hooks/navigation'
import { strings } from '~/translations/strings'

import SeedPhrase from './components/Styled'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'
import { useGetSeedPhrase } from '~/hooks/sdk'
import shuffleArray from '~/utils/arrayUtils'
import Dnd from './Dnd'

const SeedPhraseRepeat: React.FC = () => {
  const goBack = useGoBack()
  const submitIdentity = useSubmitIdentity()
  const seedphrase = useGetSeedPhrase()
  const showFailedLoader = useFailed()

  const [wrongOrder, setWrongOrder] = useState(false)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const [shuffledSeedphrase, setShuffledSeedphrase] =
    useState<string[] | null>(null)

  const isFirstFragment = useRef(Boolean(Math.round(Math.random())))

  const phraseArr = seedphrase.split(' ')
  const phraseFragmentFirst = phraseArr.slice(0, 6)
  const phraseFragmentLast = phraseArr.slice(6, 12)

  const usedFragment = isFirstFragment.current
    ? phraseFragmentFirst
    : phraseFragmentLast

  useEffect(() => {
    const shuffled = shuffleArray(usedFragment)
    setShuffledSeedphrase(shuffled)
  }, [seedphrase])

  const handlePhraseUpdate = (phrase: string[]) => {
    if (!readyToSubmit) setReadyToSubmit(true)
    setWrongOrder(false)
    setShuffledSeedphrase(phrase)
  }

  const onSubmit = async () => {
    if (isPhraseValid) {
      await submitIdentity()
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
  }, [JSON.stringify(shuffledSeedphrase), seedphrase])

  return (
    <SeedPhrase.Styled.ScreenContainer bgColor={Colors.mainBlack}>
      <SeedPhrase.Styled.Header>
        <SeedPhrase.Styled.Header.Left onPress={goBack}>
          <BackArrowIcon />
        </SeedPhrase.Styled.Header.Left>
      </SeedPhrase.Styled.Header>
      {wrongOrder ? (
        <SeedPhrase.Styled.ErrorText>
          {strings.CHECK_CAREFULLY_FOR_MISTAKES_AND_TRY_AGAIN}
        </SeedPhrase.Styled.ErrorText>
      ) : (
        <SeedPhrase.Styled.HelperText>
          {strings.DRAG_AND_DROP_THE_WORDS(isFirstFragment.current)}
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
          {strings.DONE}
        </Btn>
      </SeedPhrase.Styled.CTA>
    </SeedPhrase.Styled.ScreenContainer>
  )
}

export default SeedPhraseRepeat
