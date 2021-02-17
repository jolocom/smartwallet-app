import { FlowType } from '@jolocom/sdk'

export interface IRecordHeader {
  title?: string
  testID?: string
}

export interface IRecordItemProps {
  id: string
  isFocused: boolean
  onDropdown: () => void
}

export interface IRecordItemsListProps {
  id: string
  flows?: FlowType[]
}