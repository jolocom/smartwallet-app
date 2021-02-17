import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import { setLogged } from '~/modules/account/actions'
import { useFailed, useLoader } from '~/hooks/loader'
import { useSubmitIdentity } from '~/hooks/sdk'
import { BackArrowIcon } from '~/assets/svg'
import { useGoBack } from '~/hooks/navigation'
import { strings } from '~/translations/strings'

import SeedPhrase from './components/Styled'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'
import { useGetSeedPhrase } from '~/hooks/seedPhrase'
import shuffleArray from '~/utils/arrayUtils'
import Dnd from './Dnd'

export interface IDndProps {
  tags: string[]
  updateTags: (phrase: string[]) => void
}

const SeedPhraseRepeat: React.FC = () => {
  const goBack = useGoBack()
  const dispatch = useDispatch()
  const submitIdentity = useSubmitIdentity()
  const loader = useLoader()
  const seedphrase = useGetSeedPhrase()
  const showFailedLoader = useFailed()

  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const [shuffledSeedphrase, setShuffledSeedphrase] = useState<string[] | null>(
    null,
  )

  const handlePhraseUpdate = (phrase: string[]) => {
    if (!readyToSubmit) setReadyToSubmit(true)
    setShuffledSeedphrase(phrase)
  }

  useEffect(() => {
    const shuffled = shuffleArray(seedphrase.split(' ').slice(0, 6))
    setShuffledSeedphrase(shuffled)
  }, [seedphrase])

  const onSubmit = async () => {
    if (isPhraseValid) {
      const success = await loader(submitIdentity)
      if (success) dispatch(setLogged(true))
    } else {
      showFailedLoader()
    }
  }

  const isPhraseValid = useMemo(() => {
    if (!shuffledSeedphrase) return false
    else
      return (
        seedphrase.split(' ').splice(0, 6).join(' ') ===
        shuffledSeedphrase.join(' ')
      )
  }, [JSON.stringify(shuffledSeedphrase), seedphrase])

  return (
    <SeedPhrase.Styled.ScreenContainer bgColor={Colors.mainBlack}>
      <SeedPhrase.Styled.Header>
        <SeedPhrase.Styled.Header.Left onPress={goBack}>
          <BackArrowIcon />
        </SeedPhrase.Styled.Header.Left>
      </SeedPhrase.Styled.Header>
      <SeedPhrase.Styled.HelperText>
        {strings.DRAG_AND_DROP_THE_WORDS}
      </SeedPhrase.Styled.HelperText>
      <SeedPhrase.Styled.ActiveArea>
        {shuffledSeedphrase && shuffledSeedphrase.length > 1 ? (
          <Dnd tags={shuffledSeedphrase} updateTags={handlePhraseUpdate} />
        ) : null}
      </SeedPhrase.Styled.ActiveArea>
      <SeedPhrase.Styled.CTA>
        <Btn
          disabled={!readyToSubmit}
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
