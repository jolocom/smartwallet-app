import { AttributeTypes } from '~/types/credentials'
import createAction from '~/utils/createAction'
import {
  AttrActions,
  AttributePayload,
  AttrsState,
  AttributeI,
  AttributePayloadEdit,
} from './types'

export const initAttrs = createAction<
  AttrActions.initAttrs,
  AttrsState<AttributeI>
>(AttrActions.initAttrs)
export const updateAttrs = createAction<
  AttrActions.updateAttrs,
  AttributePayload
>(AttrActions.updateAttrs)

export const editAttr = createAction<
  AttrActions.editAttr,
  AttributePayloadEdit
>(AttrActions.editAttr)

export const deleteAttr = createAction<
  AttrActions.deleteAttr,
  { type: AttributeTypes; id: string }
>(AttrActions.deleteAttr)
