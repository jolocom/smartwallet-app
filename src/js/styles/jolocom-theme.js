import {Styles, Utils} from 'material-ui'

let {Colors, Spacing} = Styles
let {ColorManipulator} = Utils

let JolocomTheme = {
  spacing: Spacing,
  contentFontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: Colors.lightBlue500,
    primary2Color: Colors.lightBlue700,
    primary3Color: Colors.lightBlue200,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.pinkA400,
    accent3Color: Colors.pinkA100,
    textColor: Colors.darkBlack,
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3)
  }
}

export default JolocomTheme
