import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StackActions, NavigationProp } from '@react-navigation/native'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import { setLogged, setDid, setEntropy } from '~/modules/account/actions'
import { getEntropy } from '~/modules/account/selectors'
import { useAgent } from '~/hooks/sdk'
import { useLoader } from '~/hooks/useLoader'
import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

interface PropsI {
  navigation: NavigationProp<{}>
}

const SeedPhraseRepeat: React.FC<PropsI> = ({ navigation }) => {
  const redirectToEntropy = () => {
    navigation.dispatch(StackActions.popToTop()) // this is for clearing the stack;
    navigation.dispatch(StackActions.push(ScreenNames.Entropy))
  }
  const dispatch = useDispatch()
  const entropy = useSelector(getEntropy)
  const agent = useAgent()
  const loader = useLoader()

  const onSubmitIdentity = async () => {
    const entropyBuffer = new Buffer(entropy, 'hex')
    const success = await loader(
      async () => {
        // FIXME: currently not using the entropy for identity creation
        //const iw = await agent.createNewIdentity(entropyBuffer)
        const iw = await agent.createNewIdentity()

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
      <JoloText kind={JoloTextKind.title} size={JoloTextSizes.big}>
        Seed Phrase Repeat
      </JoloText>
      <Btn onPress={onSubmitIdentity}>Done</Btn>
    </ScreenContainer>
  )
}

export default SeedPhraseRepeat
