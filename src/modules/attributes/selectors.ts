import { createSelector } from 'reselect'
import { AttributeTypes } from '~/types/credentials'
import { RootReducerI } from '~/types/reducer'
import { getAttributeConfigWithValues } from '~/utils/mappings/groupBusinessCard'
import { AttrsState, AttributeI } from './types'
import { PrimitiveAttributeTypes } from '~/types/credentials'
import { getDid } from '../account/selectors'

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

export const getBusinessCardAttribute = createSelector(
  [getAttributes],
  (attributes) => {
    const { ProofOfBusinessCardCredential } = attributes
    // NOTE: we assume we can only have one business card.
    return !!ProofOfBusinessCardCredential
      ? ProofOfBusinessCardCredential[0]
      : undefined
  },
)

export const getBusinessCardConfigWithValues = createSelector(
  [getBusinessCardAttribute],
  (attribute) => {
    if (attribute) {
      return getAttributeConfigWithValues(
        AttributeTypes.businessCard,
        attribute.value,
      )
    }
    return null
  },
)
