import {fade} from 'material-ui/utils/colorManipulator'
import {lightBlue700, lightBlue200, lime300,
  lime500, lime700, darkBlack, white, grey300} from 'material-ui/styles/colors'
import Spacing from 'material-ui/styles/spacing'

let JolocomTheme = {
  spacing: Spacing,
  contentFontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#009fe3',
    primary2Color: lightBlue700,
    primary3Color: lightBlue200,
    accent1Color: lime500,
    accent2Color: lime700,
    accent3Color: lime300,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3)
  },
  textField: {
    focusColor: lime700
  }
}

export default JolocomTheme
