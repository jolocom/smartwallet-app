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
      {(Object.keys(attributes) as AttrKeys[]).map((sectionKey) => {
        const section = attributes[sectionKey]
        return (
          <View style={styles.attrSectionContainer} key={sectionKey}>
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
  attrSectionContainer: {
    marginBottom: BP({ large: 40, medium: 40, small: 20, xsmall: 20 }),
  },
})

export default AttributesWidget
