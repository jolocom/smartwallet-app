import { NavigationProp } from '@react-navigation/core'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'
import { SyntheticEvent } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { PropertyMimeType } from '~/hooks/documents/types'

export interface IWithCustomStyle<T = ViewStyle> {
  customStyles?: StyleProp<T>
}

export interface WithNavigation {
  navigation: NavigationProp<{}>
}

export type TextLayoutEvent = SyntheticEvent<{}, { lines: { text: string }[] }>

export interface IField {
  label: string
  value: ClaimEntry
  mime_type: PropertyMimeType
}
