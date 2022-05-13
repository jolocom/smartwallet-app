import { ReactNode } from 'react'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

export type FieldsCalculatorProps = (child: ReactNode, idx: number) => ReactNode

type TCommonCardProps = {
  credentialName: string
  fields: Array<Required<DisplayVal>>
  selected?: boolean
}

export type InteractionShareDocumentCardProps = {
  holderName?: string
  highlight?: string
  photo?: string
} & TCommonCardProps
