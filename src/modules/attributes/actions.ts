import { AttributeTypes } from '~/types/credentials'
import createAction from '~/utils/createAction'
import { AttrActions, AttributePayload, AttrsState, AttributeI } from './types'

export const initAttrs = createAction<AttrsState<AttributeI>>(
  AttrActions.initAttrs,
)
export const updateAttrs = createAction<AttributePayload>(
  AttrActions.updateAttrs,
)

// TODO: add type of payload for remove
export const removeAttr = createAction<{ type: AttributeTypes, id: string }>(
  AttrActions.removeAttr
)
