import React, { useEffect, useState } from 'react'
import { LayoutAnimation } from 'react-native'

import { IInteractionDetails } from '~/hooks/history/types'
import HistoryField, { HistoryFieldPlaceholder } from './HistoryField'

const HistoryInteraction: React.FC<{
  getInteractionDetails: (nonce: string) => Promise<IInteractionDetails>
  id: string
}> = ({ getInteractionDetails, id }) => {
  const [
    interactionData,
    setInteractionData,
  ] = useState<IInteractionDetails | null>(null)

  useEffect(() => {
    getInteractionDetails(id).then((interaction) => {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 500,
      })
      setInteractionData(interaction)
    })
  }, [])

  return interactionData ? (
    <HistoryField
      type={interactionData.type}
      issuerName={interactionData.issuer.publicProfile?.name}
      time={interactionData.time}
      image={interactionData.issuer.publicProfile?.image}
    />
  ) : (
    <HistoryFieldPlaceholder />
  )
}

export default HistoryInteraction
