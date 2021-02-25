import React from 'react';
import { StyleSheet, TextProps, TextStyle } from 'react-native';
import { TextLayoutEvent } from '~/components/Card/Field';
import { IWithCustomStyle } from '~/components/Card/types';
import JoloText, { JoloTextWeight } from '~/components/JoloText';
import { Colors } from '~/utils/colors';
import { useFieldCalculator } from '../FieldsCalculator/context';
import { IBodyFieldsCalculatorComposition } from '../FieldsCalculator/types';

interface ICredentialNameProps extends TextProps, IWithCustomStyle<TextStyle>  {}
export const CredentialName: React.FC<ICredentialNameProps> = ({ children, customStyles, ...props }) => {
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      customStyles={[styles.credentialName, customStyles]}
      {...props}
    >{children}</JoloText>
  )
}

export const FieldLabel: React.FC<IWithCustomStyle> = ({ children, customStyles }) => {
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      customStyles={[styles.label, customStyles]}
      numberOfLines={1}
    >
      {children}
    </JoloText>
  )
}

export const FieldValue: IBodyFieldsCalculatorComposition['FieldValue']  = ({
  children,
  customStyles,
  idx,
  onNumberOfFieldLinesToDisplay
}) => {
  const { lines, onTextLayout } = useFieldCalculator();
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      customStyles={[styles.value, customStyles]}
      // @ts-ignore: TextProps does not seem to have onTextLayout in type def. 
      onTextLayout={(e: TextLayoutEvent) => onTextLayout(e, idx)}
      numberOfLines={onNumberOfFieldLinesToDisplay(idx, lines)}
    >
      {children}
    </JoloText>
  )
}

const styles = StyleSheet.create({
  credentialName: {
    fontSize: 22,
    lineHeight: 24,
    color: Colors.black85,
    marginTop: -5,
  },
  label: {
    fontSize: 14,
    lineHeight: 14,
    color: Colors.black50,
  },
  value: {
    fontSize: 18,
    lineHeight: 18,
    color: Colors.black,
    textAlign: 'left',
    marginTop: -3
  }
})
