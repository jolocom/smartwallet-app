import { AttrsState } from '~/modules/attributes/types'
import { SelectableAttrI } from './index'

export const getMappedAttrubited = (attrs: AttrsState<string>) =>
  Object.keys(attrs).reduce((acc, val) => {
    acc[val] = attrs[val].map((attr) => ({
      val: attr,
      isSelected: false,
    }))
    return acc
  }, {} as AttrsState<SelectableAttrI>)
