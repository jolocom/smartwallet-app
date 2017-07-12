import React from 'react'
import Radium from 'radium'
import {TextField} from 'material-ui'
import {ActionSearch, NavigationArrowBack} from 'material-ui/svg-icons'

import {theme} from 'styles'

const STYLES = {
  container: {
    textColor: theme.palette.textColor,
    backgroundColor: theme.jolocom.gray3,
    width: '100%'
  },
  floatingLabelSearchField: {
    color: theme.palette.textColor,
    fontWeight: 'bold',
    paddingLeft: '5%'
  },
  leftIcon: {
    width: '5%',
    paddingLeft: '2%'
  },
  searchField: {
    width: '86%'
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
    width: '90%'
  },
  countryField: {
    width: '100%'
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
      <div style={STYLES.container}>
        <NavigationArrowBack style={STYLES.leftIcon} onClick={cancel} />
        <TextField
          style={STYLES.searchField}
          floatingLabelText="Country"
          underlineStyle={STYLES.searchFieldUnderline}
          floatingLabelStyle={STYLES.floatingLabelSearchField}
          onChange={e => change(e.target.value)}
          value={value} />
        <ActionSearch style={STYLES.rightIcon} />
      </div>
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
            onClick={() => submit(countryLabel)}
            id={`${countryLabel}_country`}
            underlineShow={false}
            style={STYLES.countryName} value={countryLabel} />
        </div>))}

    </div>)
  }
}
