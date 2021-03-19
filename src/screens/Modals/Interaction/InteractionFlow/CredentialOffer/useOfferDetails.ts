import { useEffect, useState } from 'react'
import { FlowType } from '@jolocom/sdk'
import { CredentialOfferFlow } from '@jolocom/sdk/js/interactionManager/credentialOfferFlow'

import { useInteraction } from '~/hooks/interactions'
import {
  IIncomingOfferDocProps,
  IIncomingOfferOtherProps,
} from '../components/card/types'

const useGetOfferDetails = () => {
  const getInteraction = useInteraction()

  return async () => {
    const interaction = await getInteraction()

    if (interaction.flow.type !== FlowType.CredentialOffer)
      throw new Error(
        'Error: useGetOfferDetails should be used only within a Credential Offer flow!',
      )

    return (interaction.flow as CredentialOfferFlow).getOfferDisplay()
  }
}

type IWithType = { type: string }

export const useMappedOfferDetails = () => {
  const [offerDetails, setOfferDetails] = useState<( (IWithType & IIncomingOfferDocProps)[] | (IWithType & IIncomingOfferOtherProps)[]) | null>(null)
  const getOfferDetails = useGetOfferDetails()

  const handleGettingOfferDetails = async () => {
    const details = await getOfferDetails()

    setOfferDetails(
      details.map((c) => ({
        type: c.type,
        name: c.name,
        properties: c.display.properties,
      })),
    )
  }
  useEffect(() => {
    handleGettingOfferDetails()
  }, [])

  return offerDetails
}
