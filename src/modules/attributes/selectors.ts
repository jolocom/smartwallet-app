import { RootReducerI } from '~/types/reducer'
import { AttrsState, AttributeI } from './types'
import { createSelector } from 'reselect'
import { getInteractionDetails } from '../interaction/selectors'
import { CredShareI } from '../interaction/types'
import { AttrKeys, attrTypeToAttrKey } from '~/types/credentials'

export const getAttributes = (state: RootReducerI): AttrsState<AttributeI> =>
  state.attrs.all

export const getShareAttributes = createSelector<
  RootReducerI,
  AttrsState<AttributeI>,
  CredShareI,
  AttrsState<AttributeI>
>([getAttributes, getInteractionDetails], (attributes, shareDetails) => {
  const {
    credentials: { self_issued: requestedAttributes },
  } = shareDetails

  const interactionAttributues = requestedAttributes.reduce<{
    [key: string]: AttributeI[]
  }>((acc, v) => {
    //FIXME type assertion
    const value = attrTypeToAttrKey(v) as AttrKeys
    acc[value] = attributes[value] || []
    return acc
  }, {})

  return interactionAttributues
})
