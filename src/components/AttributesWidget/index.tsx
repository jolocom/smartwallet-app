import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AttrsState, AttributeI } from '~/modules/attributes/types'

import AttrSectionHeader from './AttrSectionHeader'
import Field, { FieldTypes } from './Field'
import { AttrKeys } from '~/types/credentials'
import BP from '~/utils/breakpoints'

interface AttrsWidgetPropsI {
  attributes: AttrsState<AttributeI>
  isSelectable?: boolean
  onCreateNewAttr: (sectionKey: AttrKeys) => void
  onSelect?: (key: AttrKeys, id: string) => void
  selectedAttributes?: Record<string, string>
}

const AttributesWidget: React.FC<AttrsWidgetPropsI> = ({
  attributes,
  isSelectable = true,
  onCreateNewAttr,
  onSelect,
  selectedAttributes,
}) => {
  return (
    <>
      {(Object.keys(attributes) as AttrKeys[]).map((sectionKey, idx) => {
        const section = attributes[sectionKey]
        return (
          <View
            key={sectionKey}
            style={{
              marginBottom:
                idx === Object.keys(attributes).length - 1
                  ? 0
                  : BP({ default: 24, large: 36, medium: 36 }),
              width: '100%',
            }}
          >
            <AttrSectionHeader
              sectionKey={sectionKey}
              onCreateNew={onCreateNewAttr}
            />
            {Array.isArray(section) && section.length ? (
              isSelectable ? (
                section.map((entry) => (
                  <Field
                    key={entry.id}
                    type={FieldTypes.isSelectable}
                    value={entry.value}
                    isSelected={
                      selectedAttributes
                        ? selectedAttributes[sectionKey] === entry.id
                        : false
                    }
                    onSelect={() => onSelect && onSelect(sectionKey, entry.id)}
                    onCreateNewOne={() => onCreateNewAttr(sectionKey)}
                  />
                ))
              ) : (
                section.map((entry: AttributeI) => (
                  <Field
                    key={entry.id}
                    type={FieldTypes.isStatic}
                    value={entry.value}
                    onCreateNewOne={() => onCreateNewAttr(sectionKey)}
                  />
                ))
              )
            ) : (
              <Field
                type={FieldTypes.isEmpty}
                onCreateNewOne={() => onCreateNewAttr(sectionKey)}
              />
            )}
          </View>
        )
      })}
    </>
  )
}

const styles = StyleSheet.create({
  attrSection: {
    marginBottom: BP({ large: 36, medium: 36, small: 24, xsmall: 24 }),
  },
})

export default AttributesWidget
