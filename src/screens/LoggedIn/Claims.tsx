import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
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

  const attributes = useSelector(getAttributes)

  const startShare = () => {
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
      <Btn onPress={startShare}>Start Share</Btn>
    </ScreenContainer>
  )
}

export default Claims
