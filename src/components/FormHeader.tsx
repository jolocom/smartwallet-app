import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import JoloText, { JoloTextWeight } from '~/components/JoloText'
import useTranslation from '~/hooks/useTranslation'
import { Colors } from '~/utils/colors'

interface IAction {
  onPress: () => void
  color: Colors
}

type TActionCTA = () => void

export interface IFormHeaderComposition {
  Cancel: React.FC<{ onCancel: TActionCTA }>
  Done: React.FC<{ onSubmit: TActionCTA }>
}

const ActionBtn: React.FC<IAction> = ({ color, onPress, children }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <JoloText
        weight={JoloTextWeight.medium}
        color={color}
        children={children}
      />
    </TouchableOpacity>
  )
}

const Cancel: IFormHeaderComposition['Cancel'] = ({ onCancel }) => {
  const { t } = useTranslation()
  return (
    <ActionBtn
      onPress={onCancel}
      color={Colors.white}
      children={t('CredentialForm.closeBtn')}
    />
  )
}
const Done: IFormHeaderComposition['Done'] = ({ onSubmit }) => {
  const { t } = useTranslation()
  return (
    <ActionBtn
      onPress={onSubmit}
      color={Colors.activity}
      children={t('CredentialForm.confirmBtn')}
    />
  )
}

const FormHeader: React.FC & IFormHeaderComposition = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

FormHeader.Cancel = Cancel
FormHeader.Done = Done

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
})

export default FormHeader
