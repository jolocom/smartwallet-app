import { StyleProp, ViewStyle } from "react-native";

export enum DocumentTypes {
  document = 'document',
  other = 'other',
}

export enum DocumentFields {
  DocumentName = 'Document Name',
}

export interface IWithCustomStyle {
  customStyles?: StyleProp<ViewStyle>
}

export interface IField {
  name: string
  value: string | number
}

export interface ICardProps {
  id: string | number,
  optionalFields: IField[]
  mandatoryFields: IField[]
  image?: string | undefined
  highlight?: string | undefined
}