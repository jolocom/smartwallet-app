import { useEffect, useState } from 'react'
import { FlowType } from '@jolocom/sdk'
import { CredentialOfferFlow } from '@jolocom/sdk/js/interactionManager/credentialOfferFlow'

import { useInteraction } from '~/hooks/interactions'
import {
  IIncomingOfferDocProps,
  IIncomingOfferOtherProps,
  IProperty,
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

export const useMappedOfferDetails = () => {
  const [offerDetails, setOfferDetails] = useState<
    IIncomingOfferDocProps[] | IIncomingOfferOtherProps[] | null
  >(null)
  const getOfferDetails = useGetOfferDetails()

  const handleGettingOfferDetails = async () => {
    const details = await getOfferDetails()
    setOfferDetails(
      details.map((c) => ({
        name: c.name as string,
        properties: c.properties as IProperty[],
      })),
    )
  }
  useEffect(() => {
    handleGettingOfferDetails()
  }, [])

  return offerDetails
}
