import React from 'react';
import {View, StyleSheet} from 'react-native';

const ScreenContainer: React.FC = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScreenContainer;
