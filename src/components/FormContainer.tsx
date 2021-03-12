import React from 'react'
import Collapsible from './Collapsible'
import ScreenContainer from './ScreenContainer'
import JoloText from './JoloText'
import { useNavigation } from '@react-navigation/native'
import Btn, { BtnTypes } from './Btn'
import { TouchableOpacity } from 'react-native'

interface Props {
  title: string
  description: string
  onSubmit: () => void
}

const FormContainer: React.FC<Props> = ({
  title,
  description,
  onSubmit,
  children,
}) => {
  const navigation = useNavigation()

  const dismissScreen = () => {
    navigation.goBack()
  }

  const handleSubmit = () => {
    onSubmit()
    dismissScreen()
  }

  return (
    <Collapsible>
      <Collapsible.Header customStyles={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={dismissScreen}>
          <JoloText>Cancel</JoloText>
        </TouchableOpacity>
        <Collapsible.HeaderText>{title}</Collapsible.HeaderText>
        <TouchableOpacity onPress={handleSubmit}>
          <JoloText>Done</JoloText>
        </TouchableOpacity>
      </Collapsible.Header>
      <ScreenContainer>
        <Collapsible.ScrollView>
          <Collapsible.HidingTextContainer>
            <JoloText>{title}</JoloText>
          </Collapsible.HidingTextContainer>
          <JoloText>{description}</JoloText>
          {children}
        </Collapsible.ScrollView>
      </ScreenContainer>
    </Collapsible>
  )
}

export default FormContainer
