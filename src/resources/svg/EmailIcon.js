
import React from 'react';
import {
  Svg,
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

export default function EmailIcon(props) {
  return (
    <Svg height="24" width="24" viewBox="0 0 24 24">
    	<G fill="none" fillRule="evenodd">
    		<Path d="M0 0h24v24H0z" fill="#FFF"/>
    		<Path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z" fill="#942F51"/>
    	</G>
    </Svg>
  );
}
