import { createSelector } from 'reselect'
import { AttributeTypes } from '~/types/credentials'
import { RootReducerI } from '~/types/reducer'
import { getAttributeConfigWithValues } from '~/utils/mappings/groupBusinessCard'
import { AttrsState, AttributeI } from './types'
import { PrimitiveAttributeTypes } from '~/types/credentials'

export const getAttributes = (state: RootReducerI): AttrsState<AttributeI> =>
  state.attrs.all

export const getPrimitiveAttributes = createSelector(
  [getAttributes],
  (attributes) => {
    const { ProofOfBusinessCardCredential, ...primitiveAttributes } = attributes
    return primitiveAttributes
  },
)

export const getPrimitiveAttributeById = (id: string) =>
  createSelector([getAttributes], (attributes) => {
    const type = Object.keys(attributes).find((t) => {
      return attributes[t as PrimitiveAttributeTypes].find((a) => a.id === id)
    }) as PrimitiveAttributeTypes

    if (!type) return undefined
    return attributes[type].find((a) => a.id === id)
  })

export const getBusinessCardId = createSelector(
  [getAttributes],
  (attributes) => {
    const { ProofOfBusinessCardCredential } = attributes
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
      return getAttributeConfigWithValues(
        AttributeTypes.businessCard,
        attributes[0].value,
      )
    }
    return null
  },
)
