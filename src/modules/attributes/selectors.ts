import { createSelector } from 'reselect'
import { RootReducerI } from '~/types/reducer'
import { AttrsState, AttributeI } from './types'
import { AttributeTypes, ClaimKeys, PrimitiveAttributeTypes } from '~/types/credentials'

export const getAttributes = (state: RootReducerI): AttrsState<AttributeI> =>
  state.attrs.all

export const getPrimitiveAttributeById = (id: string) =>
  createSelector([getAttributes], (attributes) => {
    const type = Object.keys(attributes).find((t) => {
      return attributes[t as PrimitiveAttributeTypes].find((a) => a.id === id)
    }) as PrimitiveAttributeTypes

    if (!type) return undefined
    return attributes[type].find((a) => a.id === id)
  })

export const getAllValuesForType = (type: AttributeTypes) =>
  createSelector(
    [getAttributes],
    (attributes) => {
      return attributes[type] ? attributes[type]?.reduce<string[]>((acc, v) => {
        const value = Object.keys(v.value).reduce((concatValue, e) => concatValue + v.value[e as ClaimKeys], '')
        acc = [...acc, value];
        return acc;
      }, []) : []
    }
  )
