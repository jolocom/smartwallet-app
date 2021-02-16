import React from 'react';
import { StyleSheet } from 'react-native';
import { IWithCustomStyle } from '~/components/Card/types';
import JoloText, { JoloTextWeight } from '~/components/JoloText';
import { Colors } from '~/utils/colors';

export const CredentialName: React.FC<IWithCustomStyle> = ({ children, customStyles, ...props }) => {
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      customStyles={[styles.credentialName, customStyles]}
      numberOfLines={1}
      {...props}
    >{children}</JoloText>
  )
}

export const FieldLabel: React.FC<IWithCustomStyle> = ({ children, customStyles, ...props }) => {
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      customStyles={[styles.label, customStyles]}
      numberOfLines={1}
      {...props}
    >
      {children}
    </JoloText>
  )
}

export const FieldValue: React.FC<IWithCustomStyle> = ({ children, customStyles, ...props }) => {
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      customStyles={[styles.value, customStyles]}
      {...props}
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
