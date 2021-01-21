import React from 'react'
import { useDispatch } from 'react-redux'

import { setLogged } from '~/modules/account/actions'
import { useLoader } from '~/hooks/loader'
import { useSubmitIdentity } from '~/hooks/sdk'
import { BackArrowIcon } from '~/assets/svg'
import { useGoBack } from '~/hooks/navigation'
import { strings } from '~/translations/strings';

import SeedPhrase from './SeedPhrase/components/Styled'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'
import Pills from './SeedPhrase/draggable/Pills'

const SEED_KEYS = [
  'hole',
  'that',
  'quick',
  'swear',
  'prosper',
  'blast',
]


const SeedPhraseRepeat: React.FC = () => {
  const goBack = useGoBack();
  const dispatch = useDispatch()
  const submitIdentity = useSubmitIdentity()
  const loader = useLoader()

  const onSubmit = async () => {
    const success = await loader(submitIdentity)
    if (success) dispatch(setLogged(true))
  }

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

            <Pills tags={SEED_KEYS}/>
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
