import React from 'react';
import {Text, StyleSheet} from 'react-native';

import {Colors} from '~/utils/colors';

interface PropsI {
  children: React.ReactNode;
}

const Paragraph: React.FC<PropsI> = ({children}) => {
  return <Text style={styles.paragraph}>{children}</Text>;
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 20,
    color: Colors.white,
    opacity: 0.7,
  },
});

export default Paragraph;
