import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import BP from '~/utils/breakpoints';
import { Colors } from '~/utils/colors';

export const ContainerBAS: React.FC = ({ children }) => {
  const { bottom } = useSafeArea();
  return (
    <View style={[styles.containerBAS, {marginBottom: 10 + bottom}]}>
      {children}
    </View>
  )
}

export const LogoContainerBAS: React.FC = ({ children }) => (
  <View style={styles.logoContainerBAS}>
    {children}
  </View>
)

export const Space = () => <View style={{height: 48}} />

const styles = StyleSheet.create({  
  containerBAS: {
    width: '96%',
    backgroundColor: Colors.codGrey,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: BP({ large: 48, medium: 48, default: 44 }),
    paddingBottom: BP({ large: 36, medium: 36, default: 24 }),
  },
  logoContainerBAS: {
    position: 'absolute',
    top: -35,
    alignSelf: 'center',
  }
})