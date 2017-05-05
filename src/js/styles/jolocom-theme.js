/**
 * If you need to override default Material-UI styles, check the link below
 * for the corresponding component style you want to change and add the
 * updated styles to `JolocomTheme`
 * https://git.io/v6vXz
 *
 * Style guidelines for Jolocom:
 * http://bit.ly/2n5ohrH
 */

import {fade} from 'material-ui/utils/colorManipulator'
import {lime700, white, grey300} from 'material-ui/styles/colors'
import Spacing from 'material-ui/styles/spacing'

const palette = {
  primary1Color: '#b3c90f',
  primary2Color: fade('#b3c90f', 0.15),
  primary3Color: fade('#b3c90f', 0.3),
  accent1Color: '#9a3460',
  accent2Color: fade('#9a3460', 0.15),
  accent3Color: fade('#9a3460', 0.3),
  textColor: '#4b132b',
  lighterTextColor: fade('#4b132b', 0.6),
  alternateTextColor: white,
  canvasColor: white,
  borderColor: grey300,
  disabledColor: fade('#54635c', 0.3)
}

let JolocomTheme = {
  spacing: Spacing,
  contentFontFamily: 'Roboto, sans-serif',
  palette: palette,
  appBar: {
    color: '#f8f9fb',
    textColor: '#4b132b'
  },
  // Used for actionable modals, like `add node`, `link node`
  actionAppBar: {
    color: palette.primary1Color,
    textColor: '#ffffff'
  },
  inkBar: {
    backgroundColor: '#b3c90f'
  },
  tabs: {
    backgroundColor: '#f8f9fb',
    selectedTextColor: '#4b132b',
    textColor: fade('#4b132b', 0.8)
  },
  textField: {
    focusColor: lime700
  },
  graph: {
    centerNodeColor: '#8fa319',
    enlargedNodeColor: '#b3c90f',
    transitionStartNodeColor: '#6a6a6a',
    textNodeColor: '#9a9fa9',
    imageNodeColor: '#afb3bb',
    dialColor: '#d1d1d1',
    elipsisColor: '#c3c6cd',
    backgroundColor: fade('#939f9a', 0.3),
    connectionColor: fade('#939f9a', 0.15),
    whiteBackground: '#f2f2f3'
  },
  // Graph filters
  filters: {
    itemColor: fade('#000000', 0.12),
    activeItemColor: palette.primary1Color,
    iconColor: fade('#000000', 0.24),
    activeIconColor: white
  },
  jolocom: {
    gray1: '#9ba0aa',
    gray2: '#c3c6cc',
    gray3: '#e1e2e5',
    gray4: '#f8f9fb',
    gray5: '#f7f7f7'
  }
}

export default JolocomTheme
