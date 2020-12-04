import { StyleProp, ViewStyle } from 'react-native'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'

export enum DocumentTypes {
  document = 'document',
  other = 'other',
}

export enum DocumentFields {
  DocumentName = 'Document Name',
}

export enum ClaimKeys {
  givenName = 'givenName',
  familyName = 'familyName',
  id = 'id',
  photo = 'photo',
}

export interface IWithCustomStyle {
  customStyles?: StyleProp<ViewStyle>
}

export interface IField {
  name: string
  value: ClaimEntry
}

export interface ICardProps {
  id: string | number
  optionalFields: IField[]
  mandatoryFields: Array<IField | null>
  image?: string | undefined
  highlight?: string | undefined
  claims: IField[]
}
