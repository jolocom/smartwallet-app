import { useNavigation } from '@react-navigation/native';
import React from 'react';
import Block from '~/components/Block';
import JoloText from '~/components/JoloText';
import ScreenDismissable from '~/components/ScreenDismissArea';
import { ScreenNames } from '~/types/screens';

const InteractionAddCredential = () => {
  const navigation = useNavigation()
  const handleNavigateToInteraction = () => {
    navigation.goBack();
    setTimeout(() => {
      navigation.navigate(ScreenNames.InteractionFlow)
    }, 500)
  }
  return (
    <>
      <ScreenDismissable onDismiss={handleNavigateToInteraction}/>
      <Block customStyle={{paddingHorizontal: 20, paddingVertical: 100}}>
        <JoloText>
          Form
        </JoloText>
      </Block>
    </>
  )
}

export default InteractionAddCredential;