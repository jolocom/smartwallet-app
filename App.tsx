import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';

import RootNavigation from '~/RootNavigation';
import configureStore from './configureStore';

const store = configureStore();

const App = () => {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
};

export default App;
