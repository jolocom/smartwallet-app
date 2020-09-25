import React from 'react'
import { useSelector } from 'react-redux'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import CredentialCard from '../CredentialCard'
import { getCredOfferDetails } from '~/modules/interaction/selectors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import InteractionHeader from '../InteractionHeader'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'

const CredentialOfferBas = () => {
  const details = useSelector(getCredOfferDetails)
  const {
    credentials: { service_issued },
  } = details
  const { type } = service_issued[0]
  const { getHeaderText } = useCredentialOfferFlow()

  return (
    <BasWrapper>
      <InteractionHeader {...getHeaderText()} />
      <CredentialCard>
        <JoloText
          kind={JoloTextKind.title}
          size={JoloTextSizes.middle}
          color={Colors.black}
        >
          {type}
        </JoloText>
      </CredentialCard>
    </BasWrapper>
  )
}

export default CredentialOfferBas
