import createAction from '~/utils/createAction'
import {
  AttrActions,
  AttributePayload,
  AttrsState,
  AttributeI,
  AttributePayloadEdit,
} from './types'

export const initAttrs = createAction<AttrsState<AttributeI>>(
  AttrActions.initAttrs,
)
export const updateAttrs = createAction<AttributePayload>(
  AttrActions.updateAttrs,
)

export const editAttr = createAction<AttributePayloadEdit>(AttrActions.editAttr)

export const deleteAttr = createAction(AttrActions.deleteAttr)

export const resetAttrs = createAction(AttrActions.reset)
