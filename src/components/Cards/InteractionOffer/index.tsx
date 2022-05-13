import React from 'react'
import { InteractionOfferCard } from './InteractionOfferCard'
import { InteractionOfferCardProps } from './types'

export const InteractionOfferDocumentCard: React.FC<
  InteractionOfferCardProps
> = (props) => <InteractionOfferCard {...props} cardType="document" />
