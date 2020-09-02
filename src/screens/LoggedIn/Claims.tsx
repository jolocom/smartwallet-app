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
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { useSDK, useInteractionStart } from '~/hooks/sdk'
import { InteractionTransportType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import Title, { TitleKind } from '~/components/Title'

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
        loading: 'Testing',
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
        ],
      })
      .then(startInteraction)
  }

  return (
    <ScreenContainer>
      <ContainerComponent>
        <Title kind={TitleKind.subtitle} size="big">
          Hey Theres
        </Title>
        <Paragraph
          customStyles={{ marginBottom: 20 }}
          size={ParagraphSizes.large}
        >
          Below is the widget from the home page
        </Paragraph>
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
    </ScreenContainer>
  )
}

export default Claims
