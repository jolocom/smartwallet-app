import { lime700, white, grey300 } from 'material-ui/styles/colors'

import Spacing from 'material-ui/styles/spacing'
import {fade} from 'material-ui/utils/colorManipulator'

const palette = {
  primary1Color: '#b3c90f',
  primary2Color: fade('#b3c90f', 0.15),
  primary3Color: fade('#b3c90f', 0.3),
  accent1Color: '#942f51',
  accent2Color: fade('#942f51', 0.15),
  accent3Color: fade('#942f51', 0.3),
  textColor: '#4b132b',
  textColor_grey: '#a4a4a3',
  textColor_silverGrey: '#9ba0aa',
  textColor_darkBrown75: '#633c38',
  lighterTextColor: fade('#4b132b', 0.6),
  alternateTextColor: white,
  canvasColor: white,
  borderColor: grey300,
  disabledColor: '#9ba0aa'
}

const textStyles = {
  headline: {
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: '200',
    color: palette.textColor_grey
  },
  subheadline: {
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '200',
    color: palette.textColor_grey
  },
  sectionheader: {
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: '400',
    color: palette.textColor
  },
  labelInputFields: {
    fontSize: '13px',
    fontStyle: 'normal',
    fontWeight: '300',
    color: palette.textColor_darkBrown75
  },
  inputFields: {
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '400',
    color: palette.textColor_silverGrey
  },
  contentInputFields: {
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '400',
    color: palette.textColor
  },
  textCopy: {
    fontSize: '13px',
    fontStyle: 'normal',
    fontWeight: '300',
    color: palette.textColor_grey
  },
  labelButton: {
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '500',
    color: palette.accent1Color,
    textTransform: 'uppercase'
  },
  screenHeader: {
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: '500',
    color: palette.textColor
  },
  userName: {
    fontSize: '28px',
    fontStyle: 'normal',
    fontWeight: '400',
    color: palette.textColor
  }
}
let JolocomTheme = {
  spacing: Spacing,
  contentFontFamily: 'Roboto, sans-serif',
  palette: palette,
  textStyles: textStyles,
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
  jolocom: {
    gray1: '#9ba0aa',
    gray2: '#c3c6cc',
    gray3: '#e1e2e5',
    gray4: '#f8f9fb',
    gray5: '#f7f7f7'
  }
}

export default JolocomTheme
