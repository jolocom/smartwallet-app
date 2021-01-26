import { createSelector } from 'reselect'
import { RootReducerI } from '~/types/reducer'
import {
  getGroupedClaimsForBusinessCard,
  TClaimGroups,
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

export const getBusinessCardAttributes = createSelector(
  [getAttributes],
  (attributes) => {
    const { ProofOfBusinessCardCredential } = attributes
    return ProofOfBusinessCardCredential
  },
)

export const getGroupedValuesForBusinessCard = createSelector(
  [getBusinessCardAttributes],
  (attributes) => {
    if (attributes) {
      const groupedClaimsBC = getGroupedClaimsForBusinessCard()
      return Object.keys(groupedClaimsBC).reduce<TClaimGroups>(
        (groups, groupKey) => {
          const groupWithValues = groupedClaimsBC[groupKey].setGroupValues(
            attributes[0].value,
          )
          groups[groupKey] = groupWithValues
          return groups
        },
        {},
      )
    }
    return null;
  },
)
