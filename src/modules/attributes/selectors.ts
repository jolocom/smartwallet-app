import { createSelector } from 'reselect'
import { RootReducerI } from '~/types/reducer'
import { AttrsState, AttributeI } from './types'

export const getAttributes = (state: RootReducerI): AttrsState<AttributeI> =>
  state.attrs.all

export const getPrimitiveAttributes = createSelector(
  [getAttributes],
  attributes => {
    const { ProofOfBusinessCardCredential, ...primitiveAttributes } = attributes;
    return primitiveAttributes
  }
)

export const getBusinessCardAttributes = createSelector(
  [getAttributes],
  attributes => {
    const { ProofOfBusinessCardCredential } = attributes;
    return ProofOfBusinessCardCredential
  }
)
