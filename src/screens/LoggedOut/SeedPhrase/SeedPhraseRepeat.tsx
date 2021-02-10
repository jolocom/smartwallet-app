import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
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
  updateTags: Dispatch<SetStateAction<string[] | null>>
}

const SeedPhraseRepeat: React.FC = () => {
  const goBack = useGoBack()
  const dispatch = useDispatch()
  const submitIdentity = useSubmitIdentity()
  const loader = useLoader()
  const seedphrase = useGetSeedPhrase()
  const showFailedLoader = useFailed()

  const [shuffledSeedphrase, setShuffledSeedphrase] = useState<string[] | null>(
    null,
  )

  const phraseFragmentCount = Math.round(Math.random())

  const phraseArr = seedphrase.split(' ')
  const phraseFragmentFirst = phraseArr.slice(0, 6)
  const phraseFragmentLast = phraseArr.slice(6, 12)
  const usedFragment = phraseFragmentCount
    ? phraseFragmentFirst
    : phraseFragmentLast

  useEffect(() => {
    const shuffled = shuffleArray(usedFragment)
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

    return shuffledSeedphrase.join(' ') === usedFragment.join(' ')
  }, [JSON.stringify(shuffledSeedphrase), seedphrase])

  return (
    <SeedPhrase.Styled.ScreenContainer bgColor={Colors.mainBlack}>
      <SeedPhrase.Styled.Header>
        <SeedPhrase.Styled.Header.Left onPress={goBack}>
          <BackArrowIcon />
        </SeedPhrase.Styled.Header.Left>
      </SeedPhrase.Styled.Header>
      <SeedPhrase.Styled.HelperText>
        {strings.DRAG_AND_DROP_THE_WORDS(phraseFragmentCount)}
      </SeedPhrase.Styled.HelperText>
      <SeedPhrase.Styled.ActiveArea>
        {shuffledSeedphrase && shuffledSeedphrase.length > 1 ? (
          <Dnd tags={shuffledSeedphrase} updateTags={setShuffledSeedphrase} />
        ) : null}
      </SeedPhrase.Styled.ActiveArea>
      <SeedPhrase.Styled.CTA>
        <Btn onPress={onSubmit} type={BtnTypes.primary}>
          {strings.DONE}
        </Btn>
      </SeedPhrase.Styled.CTA>
    </SeedPhrase.Styled.ScreenContainer>
  )
}

export default SeedPhraseRepeat
