import { Colors } from '~/utils/colors'

export type TField = IFieldComposition & React.FC

export interface IWidgetProps {
  onAdd?: () => void
}

export interface IFieldComposition {
  Static: React.FC<Pick<IWidgetField, 'value'>>
  Selectable: React.FC<Pick<IWidgetField, 'value' | 'isSelected' | 'onSelect'>>
  Empty: React.FC
}

export interface IWidgetField {
  id: string
  value: string
  isSelected?: boolean
  color?: Colors
  onSelect?: () => void
}

export type THeader = IHeaderComposition & React.FC

export interface IHeaderComposition {
  Name: React.FC<IHeaderNameProps>
  Action: THeaderAction
}

export interface IWidgetComposition {
  Field: TField
  Header: THeader
}

export type THeaderAction = IHeaderActionComposition & React.FC

export interface IHeaderActionComposition {
  CreateNew: React.FC
}

export interface IHeaderNameProps {
  value: string
}
