import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import AbsoluteBottom from '~/components/AbsoluteBottom';
import JoloText, { JoloTextWeight } from '~/components/JoloText';
import ScreenContainer from '~/components/ScreenContainer';
import BP from '~/utils/breakpoints';
import { Colors } from '~/utils/colors';

interface IHeaderBtn {
 onPress: () => void
}

interface IStyledHeaderComposition {
 Left: React.FC<IHeaderBtn>
 Right: React.FC<IHeaderBtn>
}

// TODO: update with necessary styles after Screen Container refactoring
const StyledScreenContainer: React.FC = ({ children }) => {
 return (
  <ScreenContainer backgroundColor={Colors.transparent} customStyles={{ justifyContent: 'flex-start' }}>
   {children}
  </ScreenContainer>
 )
}

// TODO: update with necessary styles after Navigation Header refactoring
const StyledHeader: React.FC & IStyledHeaderComposition = ({ children }) => {
 return (
  <View style={styles.header}>
   {children}
  </View>
 )
}

const StyledHeaderLeft: React.FC<IHeaderBtn> = ({ children, onPress }) => {
 return (
  <View style={styles.headerLeft}>
   <TouchableOpacity onPress={onPress} style={styles.pressable}>
    {children}
   </TouchableOpacity>
  </View>
 )
}

const StyledHeaderRight: React.FC<IHeaderBtn> = ({ children, onPress }) => {
 return (
  <View style={styles.headerRight}>
   <TouchableOpacity onPress={onPress} style={styles.pressable}>
    {children}
   </TouchableOpacity>
  </View>
 )
}


const StyledHelperText: React.FC = ({ children }) => {
 return (
  <JoloText weight={JoloTextWeight.medium} customStyles={{ marginTop: 8 }}>{children}</JoloText>
 )
}

const StyledActiveArea: React.FC = ({ children }) => {
 return (
  <View style={styles.activeArea}>{children}</View>
 )
}

const StyledCTA: React.FC = ({ children }) => {
 return (
  <AbsoluteBottom>
   {children}
  </AbsoluteBottom>
 )
}

StyledHeader.Left = StyledHeaderLeft
StyledHeader.Right = StyledHeaderRight

const SeedPhrase = {
 Styled: {
  ScreenContainer: StyledScreenContainer,
  Header: StyledHeader,
  HelperText: StyledHelperText,
  ActiveArea: StyledActiveArea,
  CTA: StyledCTA
 }
}

const styles = StyleSheet.create({
 header: {
  width: Dimensions.get('window').width,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 10,
  marginBottom: 15,
  height: 50,
  alignItems: 'center',
 },
 pressable: {
  paddingVertical: 5
 },
 headerLeft: {
  alignSelf: 'center',
  flex: 1,
 },
 headerRight: {
  textAlign: 'right',
  alignItems: 'flex-end',
  flex: 1,
  paddingVertical: 5,
 },
 activeArea: {
  marginTop: BP({ default: 60, small: 40, xsmall: 30 }),
  width: '100%',
  flex: 1,
 },
})

export default SeedPhrase;

