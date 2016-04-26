import {fade} from 'material-ui/utils/colorManipulator'
import {lightBlue700, lightBlue200, pinkA200,
  pinkA400, pinkA100, darkBlack, white, grey300} from 'material-ui/styles/colors'
import Spacing from 'material-ui/styles/spacing'

let JolocomTheme = {
  spacing: Spacing,
  contentFontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#009fe3',
    primary2Color: lightBlue700,
    primary3Color: lightBlue200,
    accent1Color: pinkA200,
    accent2Color: pinkA400,
    accent3Color: pinkA100,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3)
  }
}

export default JolocomTheme
