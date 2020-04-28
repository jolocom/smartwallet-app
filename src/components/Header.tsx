import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Colors} from '~/utils/colors';

export enum HeaderSizes {
  large,
  medium,
}

interface PropsI {
  size?: HeaderSizes;
}

const Header: React.FC<PropsI> = ({size = HeaderSizes.medium, children}) => {
  return (
    <Text
      testID={'header'}
      style={[
        styles.text,
        size === HeaderSizes.large ? styles.large : styles.medium,
      ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'TTCommons-Medium',
    color: Colors.white,
    marginVertical: 5,
  },
  large: {
    fontSize: 34,
  },
  medium: {
    fontSize: 28,
  },
});

export default Header;
