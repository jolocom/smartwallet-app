import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import JoloText, { JoloTextWeight } from '~/components/JoloText';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';

interface IWordPill {
 customContainerStyles?: StyleProp<ViewStyle>
 customTextStyles?: StyleProp<TextStyle>
}

const WordPill: React.FC<IWordPill> = ({ customContainerStyles, customTextStyles, children }) => {
 return (
  <View style={[styles.container, customContainerStyles]}>
   <JoloText size={JoloTextSizes.big} weight={JoloTextWeight.medium} customStyles={[styles.text, customTextStyles]}>{children}</JoloText>
  </View>
 )
}

const styles = StyleSheet.create({
 container: {
  borderRadius: 17,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.bastille1,
  paddingHorizontal: 20,
  paddingVertical: 10,
  marginHorizontal: 5,
  marginVertical: 7
 },
 text: {
  color: Colors.activity,
  flex: 0,
 }
})

export default WordPill;