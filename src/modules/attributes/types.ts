import { AttrKeys } from '~/types/attributes'

export interface AttributesState {
  all: AttrsState<AttributeI>
}

export type AttrsState<T> = {
  [key in AttrKeys]?: T[]
}

export enum AttrActions {
  setAttrs = 'setAttrs',
  updateAttrs = 'updateAttrs', // after we have created a new one and we want to update the whole collection
}

export interface AttributeI {
  id: string
  value: string
}
