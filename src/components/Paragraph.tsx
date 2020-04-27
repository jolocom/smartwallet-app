import React from 'react';
import {Text, StyleSheet} from 'react-native';

import {Colors} from '~/utils/colors';
import {secondaryTextStyle} from '~/utils/styles';

interface PropsI {
  color?: Colors;
}

const Paragraph: React.FC<PropsI> = ({children, color = Colors.white}) => {
  return <Text style={[styles.paragraph, {color}]}>{children}</Text>;
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginVertical: 5,
    ...secondaryTextStyle,
  },
});

export default Paragraph;
