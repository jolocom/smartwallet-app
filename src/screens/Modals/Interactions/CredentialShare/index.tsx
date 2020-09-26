import React from 'react'
import CredentialShareBas from './CrendentialShareBas'
import CredentialShareFas from './CredentialShareFas'
import { useSelector } from 'react-redux'
import { getIsFullscreenCredShare } from '~/modules/interaction/selectors'

const CredentialShare = () => {
  const isFAS = useSelector(getIsFullscreenCredShare)

  return isFAS ? <CredentialShareFas /> : <CredentialShareBas />
}

export default CredentialShare
