import { DisplayVal } from '@jolocom/sdk/js/credentials'

interface CommonDocumentsProps {
  credentialName: string
  fields: Array<Required<DisplayVal>>
  onHandleMore: () => void
}

export interface DocumentCardProps extends CommonDocumentsProps {
  holderName: string
  highlight?: string
  photo?: string
}
