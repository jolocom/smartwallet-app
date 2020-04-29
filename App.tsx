import 'react-native-gesture-handler';
import React from 'react';

import RootNavigation from '~/RootNavigation';
import {ErrorBoundary} from '~/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <RootNavigation />
    </ErrorBoundary>
  );
};

export default App;
