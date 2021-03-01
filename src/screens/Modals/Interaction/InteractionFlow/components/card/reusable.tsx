import React from 'react';
import { StyleSheet, TextProps, TextStyle } from 'react-native';
import { IWithCustomStyle } from '~/components/Card/types';
import JoloText, { JoloTextWeight } from '~/components/JoloText';
import BP from '~/utils/breakpoints';
import { Colors } from '~/utils/colors';
import { debugView } from '~/utils/dev';
import { JoloTextSizes } from '~/utils/fonts';

interface ICredentialNameProps extends TextProps, IWithCustomStyle<TextStyle>  {}
export const CredentialName: React.FC<ICredentialNameProps> = ({ children, customStyles, ...props }) => {
  return (
    <JoloText
      size={JoloTextSizes.big}
      weight={JoloTextWeight.regular}
      customStyles={[styles.credentialName, customStyles]}
      {...props}
    >{children}</JoloText>
  )
}

export const FieldLabel: React.FC<IWithCustomStyle> = ({ children, customStyles }) => {
  return (
    <JoloText
      size={JoloTextSizes.tiniest}
      weight={JoloTextWeight.regular}
      customStyles={[styles.label, customStyles]}
      numberOfLines={1}
    >
      {children}
    </JoloText>
  )
}

const styles = StyleSheet.create({
  credentialName: {
    color: Colors.black85,
    lineHeight: BP({ xsmall: 20, small: 22, default: 24 }),
  },
  label: {
    lineHeight: BP({ default: 14, xsmall: 12 }),
    color: Colors.black50,
    // ...debugView()
  },
})
