import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import Paragraph from '~/components/Paragraph'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'
import { CloseIcon } from '~/assets/svg'

interface AttrSectionHeaderPropsI {
  sectionKey: string
  onCreateNew: (sectionKey: string) => void
}

const AttrSectionHeader: React.FC<AttrSectionHeaderPropsI> = ({
  sectionKey,
  onCreateNew,
}) => {
  return (
    <View style={styles.headerContainer}>
      <Paragraph color={Colors.white70} customStyles={{ opacity: 0.6 }}>
        {strings[sectionKey.toUpperCase() as 'NAME' | 'PHONE' | 'EMAIL']}
      </Paragraph>
      <TouchableOpacity
        style={styles.createNewBtn}
        onPress={() => onCreateNew(sectionKey)}
      >
        <View style={styles.plus}>
          <CloseIcon />
        </View>
        <Paragraph>{strings.CREATE_NEW_ONE}</Paragraph>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  createNewBtn: {
    flexDirection: 'row',
  },
  plus: {
    transform: [{ rotate: '45deg' }, { scale: 0.7 }],
    marginRight: 13,
    marginTop: 2,
  },
})

export default AttrSectionHeader
