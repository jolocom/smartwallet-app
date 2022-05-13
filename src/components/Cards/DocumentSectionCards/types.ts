import { DisplayVal } from '@jolocom/sdk/js/credentials'

export interface DocumentCardProps {
  credentialName: string
  fields: Array<Required<DisplayVal>>
  onHandleMore: () => void
  holderName?: string
  photo?: string
  issuerIcon?: string
  icons?: string[]
  hasImageFields?: boolean
}
