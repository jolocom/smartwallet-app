import React from 'react'
import { StyleSheet, View, GestureResponderEvent } from 'react-native'

import { AttrsState, AttributeI } from '~/modules/attributes/types'

import AttrSectionHeader from './AttrSectionHeader'
import Field, { FieldTypes } from './Field'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedAttributes } from '~/modules/interaction/selectors'
import { selectAttr } from '~/modules/interaction/actions'
import { AttrKeys } from '~/types/attributes'

interface AttrsWidgetPropsI {
  attributes: AttrsState<AttributeI>
  isSelectable?: boolean
  onCreateNewAttr: (sectionKey: AttrKeys) => void
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
            {Array.isArray(section) && section.length ? (
              isSelectable ? (
                section.map((entry) => (
                  <Field
                    key={entry.id}
                    type={FieldTypes.isSelectable}
                    value={entry.value}
                    isSelected={selectedAttributes[sectionKey] === entry.id}
                    onSelect={(e) =>
                      dispatch(
                        selectAttr({ attrKey: sectionKey, id: entry.id }),
                      )
                    }
                    onCreateNewOne={(e) =>
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
                    onCreateNewOne={(e: GestureResponderEvent) =>
                      onCreateNewAttr(sectionKey as AttrKeys)
                    }
                  />
                ))
              )
            ) : (
              <Field
                type={FieldTypes.isEmpty}
                onCreateNewOne={(e) => onCreateNewAttr(sectionKey as AttrKeys)}
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
