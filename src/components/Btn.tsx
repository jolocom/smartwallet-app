import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Colors} from '~/utils/colors';

export enum BtnTypes {
  primary,
  secondary,
}

interface PropsI {
  type?: BtnTypes;
  onPress: () => void;
  disabled?: boolean;
}

const GRADIENT_START = {x: 0, y: 0};
const GRADIENT_END = {x: 1, y: 0};

const Button: React.FC<PropsI> = ({type, onPress, children, disabled}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn} disabled={disabled}>
      <Text
        style={[
          styles.text,
          type === BtnTypes.primary ? styles.textPrimary : styles.textSecondary,
        ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const Btn: React.FC<PropsI> = (props) => {
  const containerStyles = [styles.container, props.disabled && styles.disabled];

  if (props.type === BtnTypes.primary) {
    return (
      <LinearGradient
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={containerStyles}
        colors={[Colors.disco, Colors.ceriseRed]}>
        <Button {...props} />
      </LinearGradient>
    );
  }
  return (
    <View style={containerStyles}>
      <Button {...props} />
    </View>
  );
};

Btn.defaultProps = {
  type: BtnTypes.primary,
  disabled: false,
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    width: '100%',
    borderRadius: 8,
  },
  btn: {
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 20,
    paddingTop: 5,
    color: Colors.white,
  },
  textPrimary: {
    fontFamily: 'TTCommons-Medium',
  },
  textSecondary: {
    opacity: 0.7,
    fontFamily: 'TTCommons-Regular',
  },
});

export default Btn;
