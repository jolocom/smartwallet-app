import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { PlusIcon } from '~/assets/svg'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useWidget } from './context'
import JoloText, { JoloTextKind } from '../JoloText'
import useTranslation from '~/hooks/useTranslation'

const CreateNew: React.FC = () => {
  const { t } = useTranslation()
  const widgetContext = useWidget()
  if (!widgetContext?.onAdd) {
    throw new Error('No onCreate prop passed to the widget')
  }

  return (
    <TouchableOpacity
      style={styles.createNewBtn}
      onPress={widgetContext.onAdd}
      testID="widget-add-new"
    >
      <View style={styles.plus}>
        <PlusIcon />
      </View>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.white}
      >
        {t('Identity.addClaimBtn')}
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
