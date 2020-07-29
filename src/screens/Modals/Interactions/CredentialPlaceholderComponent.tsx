import React from 'react'
import { useSelector } from 'react-redux'
import { View, StyleSheet } from 'react-native'

import { getIsFullScreenInteraction } from '~/modules/interaction/selectors'
import MultipleCredentials from './MultipleCredentials'
import AnimatedCard, { Card } from './Card'
import Paragraph from '~/components/Paragraph'
import { strings } from '~/translations/strings'
import truncateDid from '~/utils/truncateDid'
import SingleCredential from './SingleCredential'

export interface OfferCredI {
  type: [string, string]
  constrains: []
}

export interface ReceiveCredI {
  type: string
  renderInfo: {
    logo: {
      url: string
    }
    background: {
      url: string
    }
    text: {
      color: string
    }
    renderAs: 'document'
  }
}

interface CredentialPlaceholderComponentI {
  credentials: OfferCredI[] | ReceiveCredI[]
  handleSubmit: () => void
  initiatorDID: string
  onSelectCredential: (type: string) => void
}

const CredentialPlaceholderComponent: React.FC<CredentialPlaceholderComponentI> = ({
  credentials,
  handleSubmit,
  initiatorDID,
  onSelectCredential,
}) => {
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)

  const renderCards = (handletoggleScroll: (value: boolean) => void) => {
    return credentials.map((claim: any, idx: number) => (
      <AnimatedCard
        key={idx}
        onToggleScroll={handletoggleScroll}
        onSelect={() =>
          onSelectCredential(
            Array.isArray(claim.type) ? claim.type[1] : claim.type,
          )
        }
      >
        {renderCardBody(claim)}
      </AnimatedCard>
    ))
  }

  const renderCardBody = (claim: OfferCredI | ReceiveCredI) => {
    return (
      <View style={styles.cardContainer}>
        <Paragraph>
          {Array.isArray(claim.type) ? claim.type[1] : claim.type}
        </Paragraph>
      </View>
    )
  }

  if (isFullScreenInteraction) {
    return (
      <MultipleCredentials
        title={truncateString(initiatorDID)}
        onSubmit={handleSubmit}
        description={strings.CHOOSE_ONE_OR_MORE_DOCUMENTS}
      >
        {renderCards}
      </MultipleCredentials>
    )
  }
  return (
    <SingleCredential title={truncateDid(initiatorDID)} onSubmit={handleSubmit}>
      <Card isFull>{renderCardBody(credentials[0])}</Card>
    </SingleCredential>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CredentialPlaceholderComponent
