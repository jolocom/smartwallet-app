import { useState, useCallback, useEffect, useRef } from 'react'
import { AttrsState } from '~/modules/attributes/types'
import { getMappedAttrubited } from '~/utils/attributes'
import { SelectableAttrI } from '~/components/AttributesWidget/index'
import { AttrKeys } from '~/components/AttributesWidget/AttrSectionHeader'

interface SelectAttributeI {
  isSelectable: boolean
  attributes: AttrsState<string>
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
    setAttrs(() => {
      return isSelectable ? getMappedAttrubited(attributes) : attributes
    })
  }, [JSON.stringify(attributes)])

  const handleAttrSelect = useCallback(
    (sectionKey: AttrKeys, value: string) => {
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
