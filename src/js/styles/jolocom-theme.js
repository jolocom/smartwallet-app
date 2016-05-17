import {fade} from 'material-ui/utils/colorManipulator'
import {lightBlue700, lightBlue200, lime300,
  lime700, white, grey300} from 'material-ui/styles/colors'
import Spacing from 'material-ui/styles/spacing'

let JolocomTheme = {
  spacing: Spacing,
  contentFontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#009ee2',
    primary2Color: lightBlue700,
    primary3Color: lightBlue200,
    accent1Color: '#d2c844',
    accent2Color: lime700,
    accent3Color: lime300,
    textColor: '#54635c',
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade('#54635c', 0.3)
  },
  textField: {
    focusColor: lime700
  },
  graph: {
    nodeColor: '#939f9a',
    backgroundColor: fade('#939f9a', 0.3),
    connectionColor: fade('#939f9a', 0.15)
  },
  jolocom: {
    gray1: '#939f9a',
    gray2: '#bfc6c3',
    gray3: '#dfe2e1',
    gray4: '#eff1f0',
    gray5: '#f6f7f7'
  }
}

export default JolocomTheme
