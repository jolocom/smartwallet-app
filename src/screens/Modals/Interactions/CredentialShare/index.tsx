import React from 'react'
import CredentialShareBas from './CrendentialShareBas'
import CredentialShareFas from './CredentialShareFas'
import { useSelector } from 'react-redux'
import { getIsFullScreenInteraction } from '~/modules/interaction/selectors'

const CredentialShare = () => {
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)

  return isFullScreenInteraction ? (
    <CredentialShareFas />
  ) : (
    <CredentialShareBas />
  )
}

export default CredentialShare
