import { StyleProp, ViewStyle } from 'react-native'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'

export interface IWithCustomStyle {
  customStyles?: StyleProp<ViewStyle>
}

export interface IField {
  name: string
  value: ClaimEntry
}

export interface ICardProps {
  id: string
  optionalFields: IField[]
  mandatoryFields: Array<IField | null>
  image?: string | undefined
  highlight?: string | undefined
  claims: IField[]
}
