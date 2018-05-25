const primaryColors = {
  primaryColorBlack: 'black',
  primaryColorSand: '#ffefdf',
  primaryColorSandInactive: "rgba(255, 239, 223, 0.38)",
  primaryColorGrey: '#fafafa',
  primaryColorWhite: 'white',
  primaryColorPurple:'#942f51',

  dotColorActive: "#ffdebc",
  dotColorInactive: "#fffefc",

  labelFontSize: 20,
  headerFontSize: 22,
  landingHeaderFontSize: 30,

  contentFontFamily: 'TTCommons'
}

const textStyles = {
  dark: {
    appHeader: {
      fontSize: 22,
      color: primaryColors.primaryColorWhite
    },
    tabHeader: {
      active: {
        fontSize: 20,
        color: primaryColors.primaryColorSand
      },
      inactive: {
        fontSize: 20,
        color: primaryColors.primaryColorGrey
      }
    },
    labelInputField: {
      fontSize: 14,
      color: primaryColors.primaryColorGrey
    },
    textInputField: {
      fontSize: 18,
      color: primaryColors.primaryColorWhite
    },
    header: {
      fontSize: 34,
      color: primaryColors.primaryColorWhite
    },
    subheader: {
      fontSize: 30,
      color: primaryColors.primaryColorSand
    },
    textL: {
      fontSize: 20,
      color: primaryColors.primaryColorSand
    },
    textM: {
      fontSize: 18,
      color: primaryColors.primaryColorSand
    },
    textS: {
      fontSize: 14,
      color: primaryColors.primaryColorSand
    }
  },
  light: {
    labelDisplayFieldEdit: {
      fontSize: 17,
      color: primaryColors.primaryColorBlack
    },
    textDisplayFieldEdit: {
      fontSize: 22,
      color: primaryColors.primaryColorPurple
    },
    labelDisplayField: {
      fontSize: 17,
      color: primaryColors.primaryColorBlack,
      opacity: 0.4
    },
    textDisplayField: {
      fontSize: 22,
      color: primaryColors.primaryColorBlack
    },
    subheader: {
      fontSize: 30,
      color: primaryColors.primaryColorBlack
    }
  }
}

export const JolocomTheme = {
  ...primaryColors,
  textStyles
}