import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'
import { PlusIcon } from '~/assets/svg'
import { AttrKeys, AttrKeysUpper } from '~/types/attributes'

interface AttrSectionHeaderPropsI {
  sectionKey: AttrKeys
  onCreateNew: (sectionKey: AttrKeys) => void
}

const AttrSectionHeader: React.FC<AttrSectionHeaderPropsI> = ({
  sectionKey,
  onCreateNew,
}) => {
  return (
    <View style={styles.headerContainer}>
      <Paragraph
        size={ParagraphSizes.medium}
        color={Colors.white70}
        customStyles={{ opacity: 0.6 }}
      >
        {strings[sectionKey.toUpperCase() as AttrKeysUpper]}
      </Paragraph>
      <TouchableOpacity
        style={styles.createNewBtn}
        onPress={(e) => onCreateNew(sectionKey)}
      >
        <View style={styles.plus}>
          <PlusIcon />
        </View>
        <Paragraph size={ParagraphSizes.medium}>
          {strings.CREATE_NEW_ONE}
        </Paragraph>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: -5,
  },
  createNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plus: {
    transform: [{ scale: 0.7 }],
    marginRight: 3,
    marginBottom: 2,
  },
})

export default AttrSectionHeader
