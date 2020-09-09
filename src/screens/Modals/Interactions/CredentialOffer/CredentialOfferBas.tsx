import React from 'react'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import CredentialCard from '../CredentialCard'
import { useRootSelector } from '~/hooks/useRootSelector'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { isCredOfferDetails } from '~/modules/interaction/guards'

const CredentialOfferBas = () => {
  const details = useRootSelector(getInteractionDetails)
  if (isCredOfferDetails(details)) {
    const {
      credentials: { service_issued },
    } = details
    const { type } = service_issued[0]
    return (
      <BasWrapper>
        <CredentialCard>
          <JoloText
            kind={JoloTextKind.title}
            size="middle"
            color={Colors.black}
          >
            {type}
          </JoloText>
        </CredentialCard>
      </BasWrapper>
    )
  }
  return null
}

export default CredentialOfferBas
