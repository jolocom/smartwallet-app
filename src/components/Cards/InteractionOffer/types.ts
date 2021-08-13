import { DisplayVal } from '@jolocom/sdk/js/credentials'

export type InteractionOfferCardProps = {
  credentialName: string
  fields: Array<Required<Pick<DisplayVal, 'label'>>>
}
export type CardType = {
  cardType: 'document' | 'other'
}
