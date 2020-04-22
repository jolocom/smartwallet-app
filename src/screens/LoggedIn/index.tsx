import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

export enum Tabs {
  Claims = 'Claims',
  Documents = 'Documents',
  History = 'History',
  Settings = 'Settings',
}

import Claims from './Claims';
import Documents from './Documents';
import History from './History';
import Settings from './Settings';

const MainTabs = createBottomTabNavigator();

const LoggedInTabs: React.FC = () => {
  return (
    <MainTabs.Navigator>
      <MainTabs.Screen name={Tabs.Claims} component={Claims} />
      <MainTabs.Screen name={Tabs.Documents} component={Documents} />
      <MainTabs.Screen name={Tabs.History} component={History} />
      <MainTabs.Screen name={Tabs.Settings} component={Settings} />
    </MainTabs.Navigator>
  );
};

export default LoggedInTabs;
