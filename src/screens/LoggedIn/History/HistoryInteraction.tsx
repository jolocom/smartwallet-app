import React, { useEffect, useState } from 'react'
import { LayoutAnimation } from 'react-native'

import { IHistoryInteraction } from '~/hooks/history'
import HistoryField, { HistoryFieldPlaceholder } from './HistoryField'

const HistoryInteraction: React.FC<{
  loadInteraction: (nonce: string) => Promise<IHistoryInteraction>
  id: string
}> = React.memo(({ loadInteraction, id }) => {
  const [
    interactionData,
    setInteractionData,
  ] = useState<IHistoryInteraction | null>(null)

  useEffect(() => {
    loadInteraction(id).then((interaction) => {
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
      issuerName={interactionData.issuer.publicProfile?.name ?? 'Unknown'}
      time={interactionData.time}
      image={interactionData.issuer.publicProfile?.image}
    />
  ) : (
    <HistoryFieldPlaceholder />
  )
})

export default HistoryInteraction
