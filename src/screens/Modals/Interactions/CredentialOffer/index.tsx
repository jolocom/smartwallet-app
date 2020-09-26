import React from 'react'
import CredentialOfferFas from './CredentialOfferFas'
import CredentialOfferBas from './CredentialOfferBas'
import { useSelector } from 'react-redux'
import { getIsFullScreenInteraction } from '~/modules/interaction/selectors'

const CredentialOffer = () => {
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)

  return isFullScreenInteraction ? (
    <CredentialOfferFas />
  ) : (
    <CredentialOfferBas />
  )
}

export default CredentialOffer
