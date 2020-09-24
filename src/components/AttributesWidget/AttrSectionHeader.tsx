import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'
import { PlusIcon } from '~/assets/svg'
import { AttrKeys, AttrKeysUpper } from '~/types/credentials'
import JoloText, { JoloTextKind } from '../JoloText'
import { JoloTextSizes } from '~/utils/fonts'

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
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.mini}
        color={Colors.white70}
        customStyles={{ opacity: 0.6 }}
      >
        {strings[sectionKey.toUpperCase() as AttrKeysUpper]}
      </JoloText>
      <TouchableOpacity
        style={styles.createNewBtn}
        onPress={() => onCreateNew(sectionKey)}
      >
        <View style={styles.plus}>
          <PlusIcon />
        </View>
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.mini}
          color={Colors.white}
        >
          {strings.CREATE_NEW_ONE}
        </JoloText>
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
    transform: [{ scale: 0.6 }],
    marginRight: 1,
    marginBottom: 1,
  },
})

export default AttrSectionHeader
