import { useState } from 'react'
import { AttrsStateI } from '~/modules/attributes/types'
import { getMappedAttrubited } from '~/utils/attributes'
import { SelectableAttrI } from '~/components/AttributesWidget/index'

interface SelectAttributeI {
  isSelectable: boolean
  attributes: AttrsStateI<string>
}

export const useSelectAttribute = ({
  isSelectable,
  attributes,
}: SelectAttributeI) => {
  // depending on if widget is editable( isSelectable: true ) we display different attrs schemas

  const [attrs, setAttrs] = useState(
    isSelectable ? getMappedAttrubited(attributes) : attributes,
  )

  const handleAttrSelect = (sectionKey: string, value: string) => {
    const updatedAttrs = attrs[sectionKey].map((attr: SelectableAttrI) => {
      if (attr.val === value) {
        return { ...attr, isSelected: !attr.isSelected }
      }
      return attr
    })
    setAttrs({ ...attrs, [sectionKey]: updatedAttrs })
  }

  return {
    attrs,
    handleAttrSelect,
  }
}
