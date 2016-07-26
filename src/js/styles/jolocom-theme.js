import {fade} from 'material-ui/utils/colorManipulator'
import {lightBlue700, lightBlue200, lime300,
  lime700, white, grey300} from 'material-ui/styles/colors'
import Spacing from 'material-ui/styles/spacing'

let JolocomTheme = {
  spacing: Spacing,
  contentFontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#b3c90f',
    primary2Color: fade('#b3c90f', 0.15),
    primary3Color: fade('#b3c90f', 0.3),
    accent1Color: '#9a3460',
    accent2Color: fade('#9a3460', 0.15),
    accent3Color: fade('#9a3460', 0.3),
    textColor: '#4b132b',
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade('#54635c', 0.3)
  },
  appBar: {
    color: '#f0f0f0',
    textColor: '#4b132b'
  },
  inkBar: {
    backgroundColor: '#b3c90f'
  },
  tabs: {
    backgroundColor: '#f0f0f0',
    selectedTextColor: '#4b132b',
    textColor: fade('#4b132b', 0.8)
  },
  textField: {
    focusColor: lime700
  },
  graph: {
    centerNodeColor: '#b3c90f',
    transitionStartNodeColor: '#6a6a6a',
    textNodeColor: '#9a9fa9',
    imageNodeColor: '#afb3bb',
    dialColor: '#d1d1d1',
    backgroundColor: fade('#939f9a', 0.3),
    connectionColor: fade('#939f9a', 0.15)
  },
  jolocom: {
    gray1: '#9ba0aa',
    gray2: '#c3c6cc',
    gray3: '#e1e2e5',
    gray4: '#f0f0f0',
    gray5: '#f7f7f7'
  }
}

export default JolocomTheme
