import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Btn from '~/components/Btn'

import { useDispatch, useSelector } from 'react-redux'
import { setLogged, setDid, setEntropy } from '~/modules/account/actions'
import { getEntropy } from '~/modules/account/selectors'
import { useSDK } from '~/hooks/sdk'
import { useLoader } from '~/hooks/useLoader'
import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'
import useRedirectTo from '~/hooks/useRedirectTo'

const SeedPhraseRepeat: React.FC = () => {
  const redirectToEntropy = useRedirectTo(ScreenNames.Entropy)
  const dispatch = useDispatch()
  const entropy = useSelector(getEntropy)
  const SDK = useSDK()
  const loader = useLoader()

  const onSubmitIdentity = async () => {
    const entropyBuffer = new Buffer(entropy, 'hex')
    const success = await loader(
      async () => {
        const iw = await SDK.createNewIdentity(entropyBuffer)
        dispatch(setDid(iw.did))
      },
      {
        loading: strings.CREATING,
      },
    )
    if (success) {
      dispatch(setLogged(true))
      // NOTE: Entropy should only be present in the store during on-boarding (for now)
      dispatch(setEntropy(''))
    } else {
      redirectToEntropy()
    }
  }

  return (
    <ScreenContainer>
      <Header>Seed Phrase Repeat</Header>
      <Btn onPress={onSubmitIdentity}>Done</Btn>
    </ScreenContainer>
  )
}

export default SeedPhraseRepeat
