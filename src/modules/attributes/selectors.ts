import { createSelector } from 'reselect'
import { AttributeTypes } from '~/types/credentials'
import { RootReducerI } from '~/types/reducer'
import {
  getAttributeConfigWithValues,
} from '~/utils/mappings/groupBusinessCard'
import { AttrsState, AttributeI } from './types'

export const getAttributes = (state: RootReducerI): AttrsState<AttributeI> =>
  state.attrs.all

export const getPrimitiveAttributes = createSelector(
  [getAttributes],
  (attributes) => {
    const { ProofOfBusinessCardCredential, ...primitiveAttributes } = attributes
    return primitiveAttributes
  },
)

export const getBusinessCardId = createSelector(
  [getAttributes],
  (attributes) => {
    const { ProofOfBusinessCardCredential } = attributes;
    if (ProofOfBusinessCardCredential) {
      return ProofOfBusinessCardCredential[0].id
    }
    return undefined
  },
)

export const getBusinessCardAttributes = createSelector(
  [getAttributes],
  (attributes) => {
    const { ProofOfBusinessCardCredential } = attributes
    return ProofOfBusinessCardCredential
  },
)

export const getBusinessCardConfigWithValues = createSelector(
  [getBusinessCardAttributes],
  (attributes) => {
    if (attributes) {
      return getAttributeConfigWithValues(AttributeTypes.businessCard, attributes[0].value)
    }
    return null
  },
)
