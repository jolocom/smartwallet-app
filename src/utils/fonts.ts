import {Colors} from './colors';

export enum Fonts {
  Regular = 'TTCommons-Regular',
  Medium = 'TTCommons-Medium',
  Light = 'TTCommons-Light',
}

export const TextStyle = {
  middleTitleRegular: {
    fontFamily: Fonts.Regular,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: 0,
    color: Colors.white90,
  },
  middleSubtitle: {
    fontFamily: Fonts.Regular,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0.14,
    color: Colors.white70,
  },
};
