import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { PlusIcon } from '~/assets/svg'
import { strings } from '~/translations'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useWidget } from '.'
import JoloText, { JoloTextKind } from '../JoloText'

export type THeaderAction = IHeaderActionComposition & React.FC
interface IHeaderActionComposition {
  CreateNew: React.FC
}

const CreateNew: React.FC = () => {
  const { onCreate, name } = useWidget()
  return (
    <TouchableOpacity
      style={styles.createNewBtn}
      onPress={() => onCreate(name)}
    >
      <View style={styles.plus}>
        <PlusIcon />
      </View>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.white}
      >
        {strings.ADD_ATTRIBUTE}
      </JoloText>
    </TouchableOpacity>
  )
}

const HeaderAction = () => {
  return null
}

HeaderAction.CreateNew = CreateNew

const styles = StyleSheet.create({
  createNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plus: {
    height: 22,
    width: 22,
    marginRight: 10,
  },
})

export default HeaderAction
