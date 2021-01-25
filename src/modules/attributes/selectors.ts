import { createSelector } from 'reselect'
import { RootReducerI } from '~/types/reducer'
import { getGroupedClaimsForBusinessCard, TClaimGroups } from '~/utils/credentialsBySection'
import { AttrsState, AttributeI } from './types'

export const getAttributes = (state: RootReducerI): AttrsState<AttributeI> =>
  state.attrs.all

export const getGroupedValuesForBusinessCard = createSelector(
  [getAttributes],
  (attributes) => {
    // TODO: 
    const {ProofOfBusinessCardCredential} = attributes;
    if(ProofOfBusinessCardCredential) {
      const groupedClaimsBC = getGroupedClaimsForBusinessCard();
      return Object.keys(groupedClaimsBC).reduce<TClaimGroups>((groups, groupKey) => {
        const groupWithValues = groupedClaimsBC[groupKey].setGroupValues(ProofOfBusinessCardCredential[0].value);
        groups[groupKey] = groupWithValues;
        return groups
      }, {})
    }
    return {};
  }
)