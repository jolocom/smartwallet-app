import { AttrsState, AttributeI } from '~/modules/attributes/types'
import { SelectableAttrI } from '~/components/AttributesWidget/index'

export const getMappedAttrubutes = (attrs: AttrsState<AttributeI>) =>
  Object.keys(attrs).reduce((acc, v) => {
    acc[v] = attrs[v].map((attr: AttributeI) => ({
      ...attr,
      isSelected: false,
    }))
    return acc
  }, {} as AttrsState<SelectableAttrI>)
