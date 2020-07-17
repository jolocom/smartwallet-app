import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native'

import Paragraph, { ParagraphSizes } from './Paragraph'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import { CloseIcon } from '~/assets/svg'

enum Attributes {
  name = 'NAME',
}

interface PropsI {
  isSelectable?: boolean
  onSelect?: (value: string) => void
  containerComponent: React.FC
  attributes: {
    readonly [key: string]: string[]
  }
}

const AttributesWidget: React.FC<PropsI> = ({
  isSelectable = false,
  onSelect = () => {},
  containerComponent: ContainerComponent,
  attributes,
}) => {
  return (
    <ContainerComponent>
      {Object.keys(attributes).map((sectionKey) => {
        const section = attributes[sectionKey]
        return (
          <View style={styles.attrSection}>
            <View style={styles.header}>
              <Paragraph color={Colors.white70} customStyles={{ opacity: 0.6 }}>
                {strings[sectionKey.toUpperCase()]}
              </Paragraph>
              <TouchableOpacity>
                <CloseIcon />
                <Paragraph>{strings.CREATE_NEW_ONE}</Paragraph>
              </TouchableOpacity>
            </View>
            {section.length ? (
              section.map((value) => (
                <View style={styles.field}>
                  <Paragraph>{value}</Paragraph>
                </View>
              ))
            ) : (
              <View style={styles.field}>
                <Paragraph>{strings.MISSING_INFO}</Paragraph>
              </View>
            )}
          </View>
        )
      })}
    </ContainerComponent>
  )
}

const styles = StyleSheet.create({
  attrSection: {
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  field: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 23,
    backgroundColor: Colors.black,
    borderRadius: 8,
    height: 50,
    marginVertical: 4,
    paddingTop: Platform.select({
      ios: 4,
      android: 0,
    }),
  },
})

export default AttributesWidget
