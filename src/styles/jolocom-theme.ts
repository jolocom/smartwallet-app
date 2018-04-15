const { lime, white, grey } = require('material-colors')

const palette = {
  primaryColor: '#942f51',
  primary1Color: '#b3c90f',
  primary2Color: '#b3c90f',
  primary3Color: '#b3c90f',
  accent1Color: '#942f51',
  accent2Color: '#942f51',
  accent3Color: '#942f51',
  textColor: '#4b132b',
  textColor_grey: '#a4a4a3',
  textColor_silverGrey: '#9ba0aa',
  textColor_darkBrown75: '#633c38',
  lighterTextColor: '#4b132b',
  alternateTextColor: white,
  canvasColor: white,
  borderColor: grey['300'],
  disabledColor: '#9ba0aa'
}

const textStyles = {
  headline: {
    fontSize: 24,
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
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
    color: palette.textColor
  },
  labelInputFields: {
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '300',
    color: palette.textColor_darkBrown75
  },
  inputFields: {
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    color: palette.textColor_silverGrey
  },
  contentInputFields: {
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    color: palette.textColor
  },
  textCopy: {
    fontSize: 13,
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

export const JolocomTheme = {
  contentFontFamily: 'Roboto, sans-serif',
  palette,
  textStyles,
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
    textColor: '#4b132b'
  },
  textField: {
    focusColor: lime['700']
  },
  jolocom: {
    gray1: '#9ba0aa',
    gray2: '#c3c6cc',
    gray3: '#e1e2e5',
    gray4: '#f8f9fb',
    gray5: '#f7f7f7'
  }
}
