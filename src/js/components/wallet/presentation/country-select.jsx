import React from 'react'
import Radium from 'radium'
import {AppBar, ListItem} from 'material-ui'
import Avatar from 'material-ui/Avatar'

import {ActionSearch, NavigationArrowBack} from 'material-ui/svg-icons'

import {theme} from 'styles'
import {EditListItem} from './ui'

const STYLES = {
  countryName: {
    maxWidth: '95%'
  },
  countryField: {
    width: '100%'
  },
  appbar: {
    position: 'fixed'
  },
  navigation: {
    padding: '10px'
  },
  listview: {
    paddingTop: '60px'
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
      <div>
        <AppBar
          style={STYLES.appbar}
          title="Country"
          iconElementLeft={
            <NavigationArrowBack style={STYLES.navigation}
              onClick={cancel} />} />
      </div>
      <div style={STYLES.listview}>
        <EditListItem
          icon={ActionSearch}
          enableEdit
          label={' search'}
          onChange={e => change(e.target.value)}
          value={value} />
          {countries.map((countryLabel, idx) => (
            <div
              key={countryLabel}
              style={STYLES.countryField}
              onClick={() => submit(countryLabel)} >
              <ListItem
                leftAvatar={<Avatar
                  color={theme.palette.primary1Color} backgroundColor={'none'}
                  style={{left: 8}}
                  >
                  {getFirstCountryLetter(countryLabel, idx)}
                </Avatar>}
                id={`${countryLabel}_country`}
                primaryText={countryLabel} />
            </div>
        ))}
      </div>
    </div>)
  }
}
