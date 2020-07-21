import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AttrsState } from '~/modules/attributes/types'

import AttrSectionHeader, { AttrKeys } from './AttrSectionHeader'
import Field, { FieldTypes } from './Field'

interface AttrsWidgetPropsI {
  attributes: AttrsState<string> | AttrsState<SelectableAttrI>
  isSelectable?: boolean
  onAttrSelect?: (sectionKey: AttrKeys, value: string) => void
  onCreateNewAttr: (sectionKey: AttrKeys) => void
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
        const section = attributes[sectionKey as AttrKeys]
        return (
          <View style={styles.attrSectionContainer} key={sectionKey}>
            <AttrSectionHeader
              sectionKey={sectionKey as AttrKeys}
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
                    onSelect={() =>
                      onAttrSelect(sectionKey as AttrKeys, entry.val)
                    }
                    onCreateNewOne={() =>
                      onCreateNewAttr(sectionKey as AttrKeys)
                    }
                  />
                ))
              ) : (
                section.map((entry: SelectableAttrI) => (
                  <Field
                    key={entry.val}
                    type={FieldTypes.isStatic}
                    value={entry.val}
                    onCreateNewOne={() =>
                      onCreateNewAttr(sectionKey as AttrKeys)
                    }
                  />
                ))
              )
            ) : (
              <Field
                type={FieldTypes.isEmpty}
                onCreateNewOne={() => onCreateNewAttr(sectionKey as AttrKeys)}
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
