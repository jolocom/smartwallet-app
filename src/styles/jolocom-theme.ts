const { white, grey } = require('material-colors')

const palette = {
  primaryColor: '#942f51',
  primary1Color: '#b3c90f',
  primary2Color: '#b3c90f',
  primary3Color: '#b3c90f',
  accentColor: '#05050d',
  accent1Color: '#942f51',
  accent2Color: '#942f51',
  accent3Color: '#942f51',
  textColor: '#4b132b',
  canvasColor: white,
  borderColor: grey['300'],
  disabledColor: '#9ba0aa',
  primaryColorBlack: '#05050d',
  primaryColorSand: '#ffefdf',
  primaryColorGrey: '#fafafa',
  primaryColorWhite: 'white',
  backgroundContainer: '#f5f5f5',
  backgroundCard: '#fafafa',
  backgroundDot: '#545454',
  primaryTextColorSand: '#ffefdf',
  spinnerColor: '#89ffdebc',

  // TODO: remove after ui refactor
  textColor_grey: '#a4a4a3',
  textColor_silverGrey: '#9ba0aa',
  textColor_darkBrown75: '#633c38'
}

// dark: assumes dark background; light analog
const textStyles = {
  dark: {
    appHeader: {
      fontSize: 22,
      color: palette.primaryColorWhite
    },
    tabHeader: {
      active: {
        fontSize: 20,
        color: palette.primaryColorSand
      },
      inactive: {
        fontSize: 20,
        color: palette.primaryColorGrey
      }
    },
    labelInputField: {
      fontSize: 14,
      color: palette.primaryColorGrey
    },
    textInputField: {
      fontSize: 18,
      color: palette.primaryColorWhite
    },
    header: {
      fontSize: 34,
      color: palette.primaryColorWhite
    },
    subheader: {
      fontSize: 30,
      color: palette.primaryColorSand
    },
    textL: {
      fontSize: 20,
      color: palette.primaryColorSand
    },
    textM: {
      fontSize: 18,
      color: palette.primaryColorSand
    },
    textS: {
      fontSize: 14,
      color: palette.primaryColorSand
    }
  },
  light: {
    labelDisplayFieldEdit: {
      fontSize: 17,
      color: palette.primaryColorBlack
    },
    textDisplayFieldEdit: {
      fontSize: 22,
      color: palette.primaryColor
    },
    labelDisplayField: {
      fontSize: 17,
      color: palette.primaryColorBlack,
      opacity: 0.4
    },
    textDisplayField: {
      fontSize: 22,
      color: palette.primaryColorBlack
    },
    subheader: {
      fontSize: 30,
      color: palette.primaryColorBlack
    }
  },
  // old styles TODO: remove when finished with refactor ui
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

const button = {
    container: {
      backgroundColor: palette.primaryColor,
      borderRadius: 4,
      margin: 0,
      paddingLeft: 32,
      paddingRight: 32,
      paddingBottom: 16,
      paddingTop: 12
    }
  }


export const JolocomTheme = {
  contentFontFamily: 'Roboto, sans-serif',
  palette,
  textStyles,
  button
}
