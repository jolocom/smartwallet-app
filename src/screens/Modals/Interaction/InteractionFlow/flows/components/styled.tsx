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

export const ContainerFAS: React.FC = ({ children }) =>
  <View style={styles.containerFAS} children={children} />

export const LogoContainerFAS: React.FC = ({ children }) => {
  const { top } = useSafeArea();
  return (
    <View style={[
        styles.logoContainerFAS,
      {
        marginTop: BP({ large: 35, medium: 35, default: 20 }) + top,
        marginBottom: 5,
      }]}>
      {children}
    </View>
  )
}

export const FooterContainerFAS: React.FC = ({children}) => {
  const { bottom } = useSafeArea();
  return (
    <View
      style={[styles.footerContainerFAS, {paddingBottom: bottom}]}
      children={children}
    />
  )
}

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
  containerFAS: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.mainBlack,
  },
  logoContainerBAS: {
    position: 'absolute',
    top: -35,
    alignSelf: 'center',
  },
  logoContainerFAS: {
    alignItems: 'center'
  },
  footerContainerFAS: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center', 
    justifyContent: 'center',
    bottom: 0,
    height: 106,
    backgroundColor: Colors.black,
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    paddingHorizontal: '5%',
    shadowColor: Colors.black30,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 7,
    shadowOpacity: 1,
    elevation: 10,
  }
})