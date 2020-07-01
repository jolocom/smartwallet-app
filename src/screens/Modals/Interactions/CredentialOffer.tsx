import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, StyleSheet } from 'react-native'

import { useLoader } from '~/hooks/useLoader'
import { useInteraction } from '~/hooks/sdk'
import { resetInteraction } from '~/modules/interaction/actions'
import {
  getIsFullScreenInteraction,
  getInteractionSummary,
} from '~/modules/interaction/selectors'
import MultipleCredentials from './MultipleCredentials'
import AnimatedCard, { Card } from './Card'
import Paragraph from '~/components/Paragraph'
import { strings } from '~/translations/strings'
import truncateString from '~/utils/truncateString'
import SingleCredential from './SingleCredential'

const CredentialOffer = () => {
  const interaction = useInteraction()
  const loader = useLoader()
  const dispatch = useDispatch()

  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)
  const summary = useSelector(getInteractionSummary)

  const handleSubmit = async () => {
    const success = loader(
      async () => {
        const response = await interaction.createCredentialOfferResponseToken(
          [],
        )
        console.log({ response })

        const credentailReceive = await interaction.send(response)

        console.log(credentailReceive)
      },
      { showFailed: false, showSuccess: false },
    )
    dispatch(resetInteraction())
    if (!success) {
      //TODO: show toast
    }
  }

  const renderCards = (handletoggleScroll: (value: boolean) => void) => {
    return summary.state.constraints[0].credentialRequirements.map(
      (claim: any, idx: number) => (
        <AnimatedCard
          key={claim.type + idx}
          onToggleScroll={handletoggleScroll}
        >
          {renderCardBody(claim)}
        </AnimatedCard>
      ),
    )
  }

  const renderCardBody = (claim) => {
    return (
      <View style={styles.cardContainer}>
        <Paragraph>{claim.type[1]}</Paragraph>
      </View>
    )
  }

  if (isFullScreenInteraction) {
    return (
      <MultipleCredentials
        title={truncateString(summary.initiator.did)}
        onSubmit={handleSubmit}
        description={strings.CHOOSE_ONE_OR_MORE_DOCUMENTS}
      >
        {renderCards}
      </MultipleCredentials>
    )
  }
  return (
    <SingleCredential
      title={truncateString(summary.initiator.did)}
      onSubmit={handleSubmit}
    >
      <Card isFull>
        {renderCardBody(summary.state.constraints[0].credentialRequirements[0])}
      </Card>
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

export default CredentialOffer
