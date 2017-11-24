import React from 'react'
import Radium from 'radium'
import TextField from 'material-ui/TextField'
import ActionSearch from 'material-ui/svg-icons/action/search'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

import {theme} from 'styles'

const STYLES = {
  container: {
    textColor: theme.palette.textColor,
    backgroundColor: theme.jolocom.gray3,
    width: '100%'
  },
  floatingLabelSearchField: {
    color: theme.palette.textColor,
    fontWeight: 'bold'
  },
  leftIcon: {
    width: '5%'
  },
  searchField: {
    width: '90%'
  },
  searchFieldUnderline: {
    color: theme.palette.textColor
  },
  rightIcon: {
    width: '5%'
  },
  firstLetter: {
    width: '5%'
  },
  firstLetterText: {
    textAlign: 'center'
  },
  countryName: {
    width: '95%'
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

    const getFirstLetter = (label, index) =>
      (index === 0 || (label[0] !== countries[index - 1][0])) ? label[0] : ''

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
        {countries.map((countryLabel, countryIndex) => (<div
          key={countryLabel}
          style={STYLES.countryField}
          onClick={() => submit(countryLabel)} >
          <TextField
            underlineShow={false}
            id={`${countryLabel}_first_letter`}
            inputStyle={STYLES.firstLetterText}
            value={getFirstLetter(countryLabel, countryIndex)}
            style={STYLES.firstLetter} />
          <TextField
            onClick={() => submit(countryLabel)}
            id={`${countryLabel}_country`}
            underlineShow={false}
            style={STYLES.countryName}
            value={countryLabel} />
        </div>))}

    </div>)
  }
}
