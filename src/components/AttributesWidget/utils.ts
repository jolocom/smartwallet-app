import { AttrsStateI } from '~/modules/attributes/types'
import { SelectableAttrI } from './index'

export const getMappedAttrubited = (attrs: AttrsStateI<string>) =>
  Object.keys(attrs).reduce((acc, val) => {
    acc[val] = attrs[val].map((attr) => ({
      val: attr,
      isSelected: false,
    }))
    return acc
  }, {} as AttrsStateI<SelectableAttrI>)
