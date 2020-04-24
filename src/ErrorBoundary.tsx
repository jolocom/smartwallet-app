import React from 'react';
import {ErrorComponent} from './components/Error';
import Btn, {BtnTypes, BtnSize} from '~/components/Btn';
import {strings} from '~/utils/strings';

export class ErrorBoundary extends React.Component {
  public state = {
    hasError: false,
  };

  public static getDerivedStateFromError() {
    return {hasError: true};
  }

  private onPressClose = () => {
    this.setState({hasError: false});
  };

  render() {
    if (this.state.hasError) {
      // TODO An alternative solution would be to navigate to an Error screen, gather
      // the details {@title, @description} from the Error object and send them as
      // navigation props. Not sure how to handle rendering the Buttons in this case.
      return (
        <ErrorComponent
          title={strings.UNKNOWN_ERROR}
          description={
            strings.AND_IF_THIS_IS_NOT_THE_FIRST_TIME_WE_STRONGLY_RECOMMEND_LETTING_US_KNOW
          }>
          <Btn
            type={BtnTypes.secondary}
            size={BtnSize.medium}
            onPress={this.onPressClose}>
            {strings.CLOSE}
          </Btn>
        </ErrorComponent>
      );
    }

    return this.props.children;
  }
}
