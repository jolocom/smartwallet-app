import { ReactNode } from 'react'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

export type FieldsCalculatorProps = (child: ReactNode, idx: number) => ReactNode

export type InteractionShareDocumentCardProps = {
  credentialName: string
  holderName: string
  fields: Array<Required<DisplayVal>>
  highlight?: string
  photo?: string
}

export type InteractionShareOtherCardProps = {
  credentialName: string
  fields: Array<Required<DisplayVal>>
}
