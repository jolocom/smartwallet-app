import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import {Colors} from '~/utils/colors';

export enum Types {
  primary,
  secondary,
}

interface PropsI {
  type?: Types;
  children: React.ReactNode;
  onPress: () => void;
}

const Btn: React.FC<PropsI> = ({type = Types.primary, onPress, children}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn,
        type === Types.primary ? styles.primary : styles.secondary,
      ]}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  primary: {
    backgroundColor: Colors.activity,
  },
  secondary: {
    backgroundColor: 'transparent',
  },
});

export default Btn;
