import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import {Colors} from '~/utils/colors';

export enum BtnTypes {
  primary,
  secondary,
}

interface PropsI {
  type?: BtnTypes;
  onPress: () => void;
}

const Btn: React.FC<PropsI> = ({
  type = BtnTypes.primary,
  onPress,
  children,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn,
        type === BtnTypes.primary ? styles.primary : styles.secondary,
      ]}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 7,
    marginVertical: 5,
  },
  primary: {
    backgroundColor: Colors.activity,
  },
  secondary: {
    backgroundColor: 'transparent',
  },
});

export default Btn;
