import React from 'react'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import CredentialCard from '../CredentialCard'
import { useRootSelector } from '~/hooks/useRootSelector'
import { CredReceiveI } from '~/modules/interaction/types'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'

const CredentialOfferBas = () => {
  const {
    credentials: { service_issued },
  } = useRootSelector<CredReceiveI>(getInteractionDetails)
  const { type } = service_issued[0]

  return (
    <BasWrapper>
      <CredentialCard>
        <JoloText kind={JoloTextKind.title} size="middle" color={Colors.black}>
          {type}
        </JoloText>
      </CredentialCard>
    </BasWrapper>
  )
}

export default CredentialOfferBas
