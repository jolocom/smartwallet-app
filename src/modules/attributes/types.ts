import { AttributeTypes, ClaimKeys } from '~/types/credentials'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'

export interface AttributesState {
  all: AttrsState<AttributeI>
}

export type AttrsState<T> = Partial<Record<AttributeTypes, T[]>>

export enum AttrActions {
  initAttrs = 'initAttrs',
  updateAttrs = 'updateAttrs',
  editAttr = 'editAttr',
  deleteAttr = 'deleteAttr',
}

export type ClaimValues = {
  [key in ClaimKeys]?: ClaimEntry
}

export interface AttributeI<V = ClaimValues> {
  id: string
  value: V
}

export interface AttributePayload {
  type: AttributeTypes
  attribute: AttributeI
}

export interface AttributePayloadEdit extends AttributePayload {
  id: string
}
