import createAction from '~/utils/createAction'
import { AttrActions, AttributePayload, AttrsState, AttributeI } from './types'

export const initAttrs = createAction<AttrsState<AttributeI>>(
  AttrActions.setAttrs,
)
export const updateAttrs = createAction<AttributePayload>(
  AttrActions.updateAttrs,
)
