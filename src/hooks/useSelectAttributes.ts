import { useState, useCallback, useEffect, useRef } from 'react'
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

  useEffect(() => {
    setAttrs(prevAttrs => {
      return isSelectable ? getMappedAttrubited(attributes) : attributes
    })
  }, [JSON.stringify(attributes)])

  const handleAttrSelect = useCallback(
    (sectionKey: string, value: string) => {
      const updatedAttrs = attrs[sectionKey].map((attr: SelectableAttrI) => {
        if (attr.val === value) {
          return { ...attr, isSelected: !attr.isSelected }
        }
        return { ...attr, isSelected: false }
      })
      setAttrs({ ...attrs, [sectionKey]: updatedAttrs })
    },
    [JSON.stringify(attrs)],
  )

  return {
    attrs,
    handleAttrSelect,
  }
}
