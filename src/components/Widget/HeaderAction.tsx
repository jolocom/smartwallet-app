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
  const { onCreate } = useWidget()
  return (
    <TouchableOpacity style={styles.createNewBtn} onPress={onCreate}>
      <View style={styles.plus}>
        <PlusIcon />
      </View>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.white}
      >
        {strings.CREATE_NEW_ONE}
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
    transform: [{ scale: 0.6 }],
    marginRight: 1,
    marginBottom: BP({ default: 1, medium: 4, large: 4 }),
  },
})

export default HeaderAction
