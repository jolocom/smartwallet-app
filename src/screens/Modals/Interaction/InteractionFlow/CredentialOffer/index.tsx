import React from 'react'
import CredentialOfferFas from './CredentialOfferFas'
import CredentialOfferBas from './CredentialOfferBas'
import { useSelector } from 'react-redux'
import { getIsFullscreenCredOffer } from '~/modules/interaction/selectors'

const CredentialOffer = () => {
  const isFAS = useSelector(getIsFullscreenCredOffer)

  return isFAS ? <CredentialOfferFas /> : <CredentialOfferBas />
}

export default CredentialOffer
