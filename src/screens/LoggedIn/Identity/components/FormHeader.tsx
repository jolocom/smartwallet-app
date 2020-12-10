import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import JoloText, { JoloTextWeight } from '~/components/JoloText'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import { useForm } from './Form'

interface IAction {
  onPress: () => void
  color: Colors
}

export interface IFormHeaderComposition {
  Cancel: React.FC
  Done: React.FC
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

const Cancel = () => {
  const { onCancel } = useForm()
  return (
    <ActionBtn
      onPress={onCancel}
      color={Colors.white}
      children={strings.CANCEL}
    />
  )
}
const Done = () => {
  const { onSubmit } = useForm()
  return (
    <ActionBtn
      onPress={onSubmit}
      color={Colors.activity}
      children={strings.DONE}
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
    width: '100%',
  },
})

export default FormHeader
