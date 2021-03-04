import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { PlusIcon } from '~/assets/svg'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useWidget } from './context'
import JoloText, { JoloTextKind } from '../JoloText'

const CreateNew: React.FC = () => {
  const widgetContext = useWidget()
  if (!widgetContext?.onAdd) {
    throw new Error('No onCreate prop passed to the widget')
  }

  return (
    <TouchableOpacity style={styles.createNewBtn} onPress={widgetContext.onAdd}>
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
