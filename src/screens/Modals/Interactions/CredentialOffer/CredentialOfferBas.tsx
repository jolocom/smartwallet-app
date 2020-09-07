import React from 'react'
import { useSelector } from 'react-redux'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import CredentialCard from '../CredentialCard'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import { isCredOfferDetails } from '~/modules/interaction/guards'

const CredentialOfferBas = () => {
  const details = useSelector(getInteractionDetails)
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
