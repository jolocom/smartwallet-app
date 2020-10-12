import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { useLoader } from '~/hooks/useLoader'
import AttributesWidget from '~/components/AttributesWidget'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSDK, useInteractionStart } from '~/hooks/sdk'
import { InteractionTransportType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

const ContainerComponent: React.FC = ({ children }) => {
  return <View style={{ width: '100%' }}>{children}</View>
}

const Claims: React.FC = () => {
  const loader = useLoader()
  const sdk = useSDK()
  const { startInteraction } = useInteractionStart(
    InteractionTransportType.HTTP,
  )

  const openLoader = async () => {
    await loader(
      async () => {
        // throw new Error('test')
      },
      {
        success: 'Good loader',
        loading:
          'Loader with a very long description to test container height and width',
        failed: 'Bad loader',
      },
    )
  }

  const openScanner = useRedirectTo(ScreenNames.Interactions)
  const attributes = useSelector(getAttributes)

  const startShare = () => {
    sdk
      .credRequestToken({
        callbackURL: 'test',
        credentialRequirements: [
          { type: ['Credential', 'ProofOfEmailCredential'], constraints: [] },
          { type: ['Credential', 'ProofOfNameCredential'], constraints: [] },
          { type: ['Credential', 'FirstCredential'], constraints: [] },
        ],
      })
      .then(startInteraction)
  }

  const startShare1 = () => {
    sdk
      .credRequestToken({
        callbackURL: 'test',
        credentialRequirements: [
          { type: ['Credential', 'FirstCredential'], constraints: [] },
        ],
      })
      .then(startInteraction)
  }

  const startShare2 = () => {
    sdk
      .credRequestToken({
        callbackURL: 'test',
        credentialRequirements: [
          { type: ['Credential', 'ProofOfEmailCredential'], constraints: [] },
          { type: ['Credential', 'ProofOfNameCredential'], constraints: [] },
        ],
      })
      .then(startInteraction)
  }

  const startShare3 = () => {
    sdk
      .credRequestToken({
        callbackURL: 'test',
        credentialRequirements: [
          { type: ['Credential', 'ProofOfEmailCredential'], constraints: [] },
        ],
      })
      .then(startInteraction)
  }

  return (
    <ScreenContainer>
      <ContainerComponent>
        <AttributesWidget
          attributes={attributes}
          onCreateNewAttr={(sectionKey) =>
            console.log('Creating new attr for', sectionKey)
          }
          isSelectable={false}
        />
      </ContainerComponent>
      <Btn onPress={openLoader}>Open loader</Btn>
      <Btn onPress={openScanner}>Open scanner</Btn>
      <Btn onPress={startShare}>Start Share</Btn>
      <Btn onPress={startShare1}>Start Share1</Btn>
      <Btn onPress={startShare2}>Start Share2</Btn>
      <Btn onPress={startShare3}>Start Share3</Btn>
    </ScreenContainer>
  )
}

export default Claims
