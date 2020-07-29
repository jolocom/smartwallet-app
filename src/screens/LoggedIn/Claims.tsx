import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Btn from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { useLoader } from '~/hooks/useLoader'
import { useSDK, useInteractionStart } from '~/hooks/sdk'
import { InteractionChannel } from '@jolocom/sdk/js/src/lib/interactionManager/types'

const Claims: React.FC = () => {
  const loader = useLoader()
  const sdk = useSDK()
  const { startInteraction } = useInteractionStart(InteractionChannel.HTTP)
  const openLoader = async () => {
    await loader(
      async () => {
        // throw new Error('test')
      },
      {
        success: 'Good loader',
        loading: 'Testing',
        failed: 'Bad loader',
      },
    )
  }

  const onAuth = async () => {
    const authToken = await sdk.authRequestToken({
      callbackURL: 'test',
      description: 'test',
    })
    console.log(authToken)
    await startInteraction(authToken)
  }

  const openScanner = useRedirectTo(ScreenNames.Interactions)

  return (
    <ScreenContainer>
      <Header size={HeaderSizes.large}>Claims</Header>
      <Btn onPress={openLoader}>Open loader</Btn>
      <Btn onPress={openScanner}>Open scanner</Btn>
      <Btn onPress={onAuth}>Start Auth</Btn>
    </ScreenContainer>
  )
}

export default Claims
