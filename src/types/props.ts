import { SyntheticEvent } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'
import { NavigationProp } from '@react-navigation/core'

export interface IWithCustomStyle<T = ViewStyle> {
  customStyles?: StyleProp<T>
}

export interface WithNavigation {
  navigation: NavigationProp<{}>
}

export type TextLayoutEvent = SyntheticEvent<{}, { lines: number[] }>

export interface IField {
  label: string
  value: ClaimEntry
}
