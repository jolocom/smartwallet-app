import React from 'react'
import { useSelector } from 'react-redux'

import FasWrapper from '~/components/ActionSheet/FasWrapper'
import { getOfferCredentialsBySection } from '~/modules/interaction/selectors'
import InteractionSection from '../InteractionSection'
import CredentialCard from '../CredentialCard'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import { OfferUICredential } from '~/types/credentials'

const CredentialOfferFas = () => {
  const { documents, other } = useSelector(getOfferCredentialsBySection)

  const renderCredentials = (credentials: OfferUICredential[]) =>
    credentials.map(({ type, invalid }) => (
      <CredentialCard disabled={invalid}>
        <Header color={Colors.black}>{type}</Header>
      </CredentialCard>
    ))

  return (
    <FasWrapper>
      {!!documents.length && (
        <InteractionSection title={'Documents'}>
          {renderCredentials(documents)}
        </InteractionSection>
      )}
      {!!other.length && (
        <InteractionSection title={'Others'}>
          {renderCredentials(other)}
        </InteractionSection>
      )}
    </FasWrapper>
  )
}

export default CredentialOfferFas
