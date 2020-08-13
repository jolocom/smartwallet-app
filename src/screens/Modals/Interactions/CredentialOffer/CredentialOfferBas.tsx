import React from 'react'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import CredentialCard from '../CredentialCard'
import { useRootSelector } from '~/hooks/useRootSelector'
import { CredReceiveI } from '~/modules/interaction/types'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import Header from '~/components/Header'
import { ImageBackground } from 'react-native'
import { Colors } from '~/utils/colors'

const CredentialOfferBas = () => {
  const {
    credentials: { service_issued },
  } = useRootSelector<CredReceiveI>(getInteractionDetails)
  const { type } = service_issued[0]

  return (
    <BasWrapper>
      <CredentialCard>
        <Header color={Colors.black}>{type}</Header>
      </CredentialCard>
    </BasWrapper>
  )
}

export default CredentialOfferBas
