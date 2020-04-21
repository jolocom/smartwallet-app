import React from 'react';
import {Text, StyleSheet} from 'react-native';

export enum Sizes {
  large,
  medium,
}

interface PropsI {
  size?: Sizes;
  children: React.ReactNode;
}

const Header: React.FC<PropsI> = ({size = Sizes.large, children}) => {
  return (
    <Text style={size === Sizes.large ? styles.large : styles.medium}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  large: {
    fontSize: 34,
  },
  medium: {
    fontSize: 28,
  },
});

export default Header;
