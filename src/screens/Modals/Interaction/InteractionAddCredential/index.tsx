import { useKeyboard } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { LayoutAnimation, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import Block from '~/components/Block';
import ScreenDismissArea from '~/components/ScreenDismissArea';
import { ScreenNames } from '~/types/screens';
import { Colors } from '~/utils/colors';
import IntermediarySheetBody from './IntermediarySheetBody';

const InteractionAddCredential = () => {
  const navigation = useNavigation()
  const handleNavigateToInteraction = () => {
    navigation.goBack();
    setTimeout(() => {
      navigation.navigate(ScreenNames.InteractionFlow)
    }, 500)
  }
  const { keyboardHeight } = useKeyboard();
  const [pushUpTo, setPushUpTo] = useState(0)

  useLayoutEffect(() => {
      LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
      })
    setPushUpTo(keyboardHeight + 8)
  }, [keyboardHeight])
  
  const {bottom} = useSafeArea()
  return (
    <>
      <ScreenDismissArea onDismiss={handleNavigateToInteraction} />
      <View style={{ padding: 8, alignItems: 'center', paddingBottom: pushUpTo || bottom }}>
        <Block customStyle={{ borderRadius: 20, backgroundColor: Colors.codGrey, padding: 16, paddingBottom: 34 }}>
          <IntermediarySheetBody />
        </Block>
      </View>
    </>
  )
}

export default InteractionAddCredential;