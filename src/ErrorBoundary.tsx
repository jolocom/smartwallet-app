import React from 'react';
import {Text} from 'react-native';
import ScreenContainer from './components/ScreenContainer';

export class ErrorBoundary extends React.Component {
  public state = {
    hasError: false,
  };

  public static getDerivedStateFromError() {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScreenContainer>
          <Text>Oh no, something happened</Text>
        </ScreenContainer>
      );
    }

    return this.props.children;
  }
}
