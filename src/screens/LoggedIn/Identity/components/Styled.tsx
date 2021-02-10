import React from 'react'
import { StyleSheet, View } from "react-native"

import Block from "~/components/Block"
import { IWithCustomStyle } from '~/components/Card/types'
import JoloText, { JoloTextKind } from "~/components/JoloText"
import { Colors } from "~/utils/colors"
import { JoloTextSizes } from "~/utils/fonts"

export interface IStyledComposition {
 Container: React.FC,
 Title: React.FC<IWithColor>,
 FieldName: React.FC,
 FieldValue: React.FC<IWithColor>,
 FieldGroup: React.FC<IWithCustomStyle>
}

interface IWithColor {
 color: Colors
}

const CardContainer: React.FC = ({ children }) => {
 return (
  <Block customStyle={styles.cardContainer}>
   <View style={styles.cardNestedContainer}>{children}</View>
  </Block>
 )
}

const CardTitle: React.FC<IWithColor> = ({children, color}) => {
 return (
  <JoloText size={JoloTextSizes.big} color={color} customStyles={{textAlign: 'left'}}>
   {children}
  </JoloText>
 )
}

const CardFieldName: React.FC = ({children}) => {
 return (
  <JoloText size={JoloTextSizes.mini} color={Colors.white45}>
   {children}
  </JoloText>
 )
}

const CardFieldValue: React.FC<IWithColor> = ({children, color}) => {
 return (
  <JoloText kind={JoloTextKind.title} size={JoloTextSizes.mini} color={color} customStyles={{paddingTop: 0}}>
   {children}
  </JoloText>
 )
}

const CardFieldGroup: React.FC<IWithCustomStyle> = ({children, customStyles}) => {
 return (
  <View style={[styles.fieldGroup, customStyles]}>
   {children}
  </View>
 )
}

const Styled: IStyledComposition = {
 Container: CardContainer,
 Title: CardTitle,
 FieldName: CardFieldName,
 FieldValue: CardFieldValue,
 FieldGroup: CardFieldGroup
}

const styles = StyleSheet.create({
 cardContainer: { padding: 20, alignItems: 'center', marginTop: 30, height: 212 },
 cardNestedContainer: { width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-between' },
 fieldGroup: {
  alignItems: 'flex-start'
 }
})

export default Styled;
