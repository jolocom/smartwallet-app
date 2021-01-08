import React from 'react';
import { View } from 'react-native';
import { ITabPersistChildren } from './Tabs';

const PersistChildren: React.FC<ITabPersistChildren> = ({ children, isContentVisible }) => {
  return (
    <View
      style={{
        display: isContentVisible ? 'flex' : 'none',
      }}
    >
      {children}
    </View>
  )
}

export default PersistChildren;