import { useEffect, useState } from 'react'
import { FlowType } from '@jolocom/sdk'
import { CredentialOfferFlow } from '@jolocom/sdk/js/interactionManager/credentialOfferFlow'

import { useInteraction } from '~/hooks/interactions/handlers'
import { CredentialDisplay } from '@jolocom/sdk/js/credentials'

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
  const [offerDetails, setOfferDetails] = useState<CredentialDisplay[] | null>(
    null,
  )
  const getOfferDetails = useGetOfferDetails()

  const handleGettingOfferDetails = async () => {
    const details = await getOfferDetails()
    setOfferDetails(details)
  }
  useEffect(() => {
    handleGettingOfferDetails()
  }, [])

  return offerDetails
}
