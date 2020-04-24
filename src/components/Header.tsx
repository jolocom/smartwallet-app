import React from 'react';
import {Text, StyleSheet} from 'react-native';

export enum HeaderSizes {
  large,
  medium,
}

interface PropsI {
  size?: HeaderSizes;
}

const Header: React.FC<PropsI> = ({size = HeaderSizes.large, children}) => {
  return (
    <Text style={size === HeaderSizes.large ? styles.large : styles.medium}>
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
