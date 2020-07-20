import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AttrsStateI } from '~/modules/attributes/types'

import AttrSectionHeader from './AttrSectionHeader'
import Field, { FieldTypes } from './Field'

interface AttrsWidgetPropsI {
  attributes: AttrsStateI<string> | AttrsStateI<SelectableAttrI>
  containerComponent: React.FC
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
  containerComponent: ContainerComponent,
  isSelectable = true,
  onAttrSelect,
  onCreateNewAttr = (sectionKey) =>
    console.log('Creating new attr for', sectionKey),
}) => {
  return (
    <ContainerComponent>
      {Object.keys(attributes).map((sectionKey) => {
        const section = attributes[sectionKey]
        console.log({ section })

        return (
          <View style={styles.attrSectionContainer} key={sectionKey}>
            <AttrSectionHeader
              sectionKey={sectionKey}
              onCreateNew={onCreateNewAttr}
            />
            {section.length ? (
              section.map((entry: SelectableAttrI) => (
                <Field
                  key={entry.val}
                  type={
                    isSelectable ? FieldTypes.isSelectable : FieldTypes.isStatic
                  }
                  value={entry.val}
                  isSelected={entry.isSelected}
                  onSelect={() => onAttrSelect(sectionKey, entry.val)}
                />
              ))
            ) : (
              <Field type={FieldTypes.isEmpty} />
            )}
          </View>
        )
      })}
    </ContainerComponent>
  )
}

const styles = StyleSheet.create({
  attrSectionContainer: {
    marginBottom: 40,
  },
})

export default AttributesWidget
