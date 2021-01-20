import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import JoloText, { JoloTextWeight } from '~/components/JoloText';
import BP from '~/utils/breakpoints';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';

interface IWordPill {
 customContainerStyles?: StyleProp<ViewStyle>
 customTextStyles?: TextStyle
}

const WordPill: React.FC<IWordPill> = ({ customContainerStyles, customTextStyles, children }) => {
 return (
  <View style={[styles.container, customContainerStyles]}>
   <JoloText size={JoloTextSizes.big} weight={JoloTextWeight.medium} customStyles={customTextStyles}>{children}</JoloText>
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
  marginHorizontal: BP({ default: 5, small: 3, xsmall: 3 }),
  marginVertical: BP({ default: 7, small: 5, xsmall: 5 }),
  shadowOffset: {
   width: 5,
   height: 4,
  },
  shadowOpacity: 0.67,
  shadowRadius: 4.65,

  elevation: 6,
 },
})

export default WordPill;