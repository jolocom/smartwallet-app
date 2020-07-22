import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AttrsState, AttributeI } from '~/modules/attributes/types'

import AttrSectionHeader, { AttrKeys } from './AttrSectionHeader'
import Field, { FieldTypes } from './Field'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedAttributes } from '~/modules/interaction/selectors'
import { selectAttr } from '~/modules/interaction/actions'

interface AttrsWidgetPropsI {
  attributes: AttrsState<AttributeI>
  isSelectable?: boolean
  onCreateNewAttr: (sectionKey: AttrKeys) => void
}

export interface SelectableAttrI {
  id: string
  isSelected: boolean
  value: string
}

const AttributesWidget: React.FC<AttrsWidgetPropsI> = ({
  attributes,
  isSelectable = true,
  onCreateNewAttr,
}) => {
  const dispatch = useDispatch()
  const selectedAttributes = useSelector(getSelectedAttributes)
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
                section.map((entry) => (
                  <Field
                    key={entry.id}
                    type={FieldTypes.isSelectable}
                    value={entry.value}
                    isSelected={selectedAttributes[sectionKey] === entry.id}
                    onSelect={() =>
                      dispatch(
                        selectAttr({ attrKey: sectionKey, id: entry.id }),
                      )
                    }
                    onCreateNewOne={() =>
                      onCreateNewAttr(sectionKey as AttrKeys)
                    }
                  />
                ))
              ) : (
                section.map((entry: AttributeI) => (
                  <Field
                    key={entry.id}
                    type={FieldTypes.isStatic}
                    value={entry.value}
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
