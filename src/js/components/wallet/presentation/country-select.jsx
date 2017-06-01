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
    countries: React.PropTypes.Object,
    submit: React.PropTypes.func,
    change: React.PropTypes.func,
    value: React.PropTypes.string,
    cancel: React.PropTypes.func
  }

  render() {
    const showFirstLetter = (e, i, countries) =>
    (i === 0 || (e[0] !== countries[i - 1][0])) ? e[0] : ''
    const {countries, submit, cancel, change, value} = this.props
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
        {countries.map((e, i) => (<div
          style={STYLES.countryField}
          onClick={() => submit(e)} >
          <TextField
            underlineShow={false}
            inputStyle={STYLES.firstLetterText}
            value={showFirstLetter(e, i, countries)}
            style={STYLES.firstLetter} />
          <TextField
            onClick={() => submit(e)}
            underlineShow={false}
            style={STYLES.countryName} value={e} />
        </div>))}

    </div>)
  }
}
