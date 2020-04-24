import {StackNavigationOptions} from '@react-navigation/stack';
import {Fonts} from './fonts';

export const modalScreenOptions: StackNavigationOptions = {
  cardStyle: {backgroundColor: 'black'},
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({current: {progress}}) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.8],
        extrapolate: 'clamp',
      }),
    },
  }),
};

export const secondaryTextStyle = {
  opacity: 0.8,
  fontFamily: Fonts.Regular,
};

export const debug = {
  borderColor: 'red',
  borderWidth: 1,
};
