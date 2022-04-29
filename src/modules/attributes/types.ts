import { AttributeTypes, ClaimKeys } from '~/types/credentials'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'

export enum AttrActionType {
  initAttrs = 'initAttrs',
  updateAttrs = 'updateAttrs',
  editAttr = 'editAttr',
  deleteAttr = 'deleteAttr',
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface AttrActions {
  [AttrActionType.initAttrs]: AttrsState<AttributeI>
  [AttrActionType.updateAttrs]: AttributePayload
  [AttrActionType.editAttr]: AttributePayloadEdit
  [AttrActionType.deleteAttr]: { type: AttributeTypes; id: string }
}

// Dependency between action type and its payload following Action type signature
export type AttrAction<A extends keyof AttrActions> = {
  type: A
  payload: AttrActions[A]
}

// TODO: very hard to see when we use AttributesState and AttrsState
export interface AttributesState {
  all: AttrsState<AttributeI>
}

// TODO: very hard to see when we use AttributesState and AttrsState
export type AttrsState<T> = Partial<Record<AttributeTypes, T[]>>

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
