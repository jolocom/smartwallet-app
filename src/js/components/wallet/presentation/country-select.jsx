import React from 'react'
import Radium from 'radium'
import {TextField, AppBar} from 'material-ui'
import {ActionSearch, NavigationArrowBack} from 'material-ui/svg-icons'

import {theme} from 'styles'

const STYLES = {
  container: {
    textColor: theme.palette.textColor,
    backgroundColor: theme.jolocom.gray3,
    width: '100%'
  },
  floatingLabelSearchField: {
    color: theme.palette.textColor
  },
  leftIcon: {
    width: '5%',
    paddingLeft: '2%'
  },
  searchField: {
    width: '70%',
    paddingLeft: '10%',
    marginBottom: '16px'
  },
  searchFieldUnderline: {
    color: theme.palette.textColor
  },
  rightIcon: {
    width: '5%',
    paddingRight: '2%'
  },
  firstLetter: {
    width: '10%'
  },
  firstLetterText: {
    textAlign: 'center',
    color: theme.palette.primary1Color
  },
  countryName: {
    maxWidth: '95%'
  },
  countryField: {
    width: '100%'
  },
  headerAppbar: {
    fontSize: theme.textStyles.headline.fontSize,
    fontWeight: '400',
    color: theme.textStyles.sectionheader.textColor,
    padding: '25px 5px 15px 50px'
  }
}

@Radium
export default class CountrySelectPresentation extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    countries: React.PropTypes.array,
    submit: React.PropTypes.func,
    change: React.PropTypes.func,
    value: React.PropTypes.string,
    cancel: React.PropTypes.func
  }

  render() {
    const {countries, submit, cancel, change, value} = this.props

    const getFirstCountryLetter = (countryLabel, countryIndex) =>
      (countryIndex === 0 ||
       (countryLabel[0] !== countries[countryIndex - 1][0]))
        ? countryLabel[0] : ''

    return (<div>
      <AppBar
        title="Country"
        iconElementLeft={
          <NavigationArrowBack style={{padding: '10px'}} onClick={cancel} />
          } />
      <TextField
        style={STYLES.searchField}
        floatingLabelText={<ActionSearch style={STYLES.rightIcon} />}
        underlineStyle={STYLES.searchFieldUnderline}
        floatingLabelStyle={STYLES.floatingLabelSearchField}
        onChange={e => change(e.target.value)}
        value={value} />
        {countries.map((countryLabel, idx) => (<div
          key={countryLabel}
          style={STYLES.countryField}
          onClick={() => submit(countryLabel)} >
          <TextField
            underlineShow={false}
            id={`${countryLabel}_first_letter`}
            inputStyle={STYLES.firstLetterText}
            value={getFirstCountryLetter(countryLabel, idx)}
            style={STYLES.firstLetter} />
          <TextField
            id={`${countryLabel}_country`}
            underlineShow={false}
            style={STYLES.countryName} value={countryLabel} />
        </div>))}

    </div>)
  }
}
