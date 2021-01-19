import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AbsoluteBottom from '~/components/AbsoluteBottom';
import JoloText, { JoloTextWeight } from '~/components/JoloText';
import ScreenContainer from '~/components/ScreenContainer';
import BP from '~/utils/breakpoints';
import { debugView } from '~/utils/dev';

const StyledScreenContainer: React.FC = ({ children }) => {
 return (
  <ScreenContainer backgroundColor={Colors.transparent} hasHeaderBack customStyles={{ justifyContent: 'flex-start' }}>
   {children}
  </ScreenContainer>
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

const SeedPhrase = {
 Styled: {
  ScreenContainer: StyledScreenContainer,
  HelperText: StyledHelperText,
  ActiveArea: StyledActiveArea,
  CTA: StyledCTA
 }
}

const styles = StyleSheet.create({
 activeArea: {
  marginTop: BP({ default: 60, small: 40, xsmall: 30 }),
  height: 200,
  width: '100%',
  ...debugView()
 },
 cta: {
  ...debugView()
 }
})

export default SeedPhrase;

