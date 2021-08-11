import { SyntheticEvent } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'

export interface IWithCustomStyle<T = ViewStyle> {
  customStyles?: StyleProp<T>
}

export type TextLayoutEvent = SyntheticEvent<{}, { lines: number[] }>

export interface IField {
  label: string
  value: ClaimEntry
}
