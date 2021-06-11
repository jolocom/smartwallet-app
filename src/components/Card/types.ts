import { StyleProp, ViewStyle } from 'react-native'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'

export interface IWithCustomStyle<T = ViewStyle> {
  customStyles?: StyleProp<T>
}

export interface IField {
  label: string
  value: ClaimEntry
}

export interface ICardProps {
  id: string
  type: string
  optionalFields: IField[]
  mandatoryFields: Array<IField | null>
  photo?: string | undefined
  highlight?: string | undefined
}

interface IOptionalFields extends IWithCustomStyle {
  lastFieldPadding?: string
}

export interface ICardComposition {
  OptionalFields: React.FC<IOptionalFields>
  DocumentHeader: React.FC
  OtherHeader: React.FC
  Highlight: React.FC
  Photo: React.FC
  Dots: React.FC<IWithCustomStyle>
}
