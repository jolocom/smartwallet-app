import createAction from '~/utils/createAction'
import { AttrActions, AttrAction, AttrActionType } from './types'

// To avoid manually passing a generic type every time we call `createAction`
// redeclaring createAction fn with types specific to the `account` module
function createAttrAction<K extends keyof AttrActions>(type: K) {
  return createAction<AttrAction<K>>(type)
}

export const initAttrs = createAttrAction(AttrActionType.initAttrs)

export const updateAttrs = createAttrAction(AttrActionType.updateAttrs)

export const editAttr = createAttrAction(AttrActionType.editAttr)

export const deleteAttr = createAttrAction(AttrActionType.deleteAttr)
