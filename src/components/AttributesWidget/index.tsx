import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AttrsStateI } from '~/modules/attributes/types'

import AttrSectionHeader from './AttrSectionHeader'
import Field, { FieldTypes } from './Field'

interface AttrsWidgetPropsI {
  attributes: AttrsStateI<string> | AttrsStateI<SelectableAttrI>
  isSelectable?: boolean
  onAttrSelect: (sectionKey: string, value: string) => void
  onCreateNewAttr: (sectionKey: string) => void
}

export interface SelectableAttrI {
  isSelected: boolean
  val: string
}

const AttributesWidget: React.FC<AttrsWidgetPropsI> = ({
  attributes,
  isSelectable = true,
  onAttrSelect,
  onCreateNewAttr,
}) => {
  return (
    <>
      {Object.keys(attributes).map((sectionKey) => {
        const section = attributes[sectionKey]
        return (
          <View style={styles.attrSectionContainer} key={sectionKey}>
            <AttrSectionHeader
              sectionKey={sectionKey}
              onCreateNew={onCreateNewAttr}
            />
            {section.length ? (
              isSelectable ? (
                section.map((entry: SelectableAttrI) => (
                  <Field
                    key={entry.val}
                    type={FieldTypes.isSelectable}
                    value={entry.val}
                    isSelected={entry.isSelected}
                    onSelect={() => onAttrSelect(sectionKey, entry.val)}
                    onCreateNewOne={() => onCreateNewAttr(sectionKey)}
                  />
                ))
              ) : (
                section.map((entry: SelectableAttrI) => (
                  <Field
                    key={entry.val}
                    type={FieldTypes.isStatic}
                    value={entry.val}
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
    marginBottom: 40,
  },
})

export default AttributesWidget
