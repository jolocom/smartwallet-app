import React from 'react'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import CredentialCard from '../CredentialCard'
import { useRootSelector } from '~/hooks/useRootSelector'
import {
  getInteractionDetails,
  isCredOfferDetails,
} from '~/modules/interaction/selectors'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'

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
          <Header color={Colors.black}>{type}</Header>
        </CredentialCard>
      </BasWrapper>
    )
  }
  return null
}

export default CredentialOfferBas
