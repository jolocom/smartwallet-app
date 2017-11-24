import React from 'react'
import Radium from 'radium'
import AppBar from 'material-ui/AppBar'
import ListItem from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import ActionSearch from 'material-ui/svg-icons/action/search.js'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back.js'

import { theme } from 'styles'
import { EditListItem } from './ui'

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
  },
  countryListPosition: {
    marginTop: '60px'
  },
  stickySearchfield: {
    position: 'fixed',
    zIndex: '100',
    backgroundColor: 'white',
    width: '100%'
  },
  countryInnerStyle: {
    paddingLeft: '54px'
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
    cancel: React.PropTypes.func,
    setFocused: React.PropTypes.func,
    focusedGroup: React.PropTypes.string
  }

  componentWillMount() {
    window.scrollTo(0, 0)
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
          title="Country Selection"
          iconElementLeft={
            <NavigationArrowBack style={STYLES.navigation}
              onClick={cancel} />} />
      </div>
      <div style={STYLES.listview}>
        <div style={STYLES.stickySearchfield}>
          <EditListItem
            onFocusChange={(field) => this.props.setFocused(field, 'country')}
            focused={this.props.focusedGroup === 'country' && !!ActionSearch}
            icon={ActionSearch}
            enableEdit
            label={' search your country'}
            onChange={e => change(e.target.value)}
            value={value} /></div>
        <div style={STYLES.countryListPosition}>
          {countries.map((countryLabel, idx) => (
            <div
              key={countryLabel}
              style={STYLES.countryField}
              onClick={() => submit(countryLabel)} >
              <ListItem
                innerDivStyle={STYLES.countryInnerStyle}
                leftAvatar={<Avatar
                  color={theme.palette.primary1Color} backgroundColor={'none'}
                  style={{left: 8}}
                  >
                  {getFirstCountryLetter(countryLabel, idx)}
                </Avatar>}
                id={`${countryLabel}_country`}
                primaryText={countryLabel} />
            </div>
        ))}</div>
      </div>
    </div>)
  }
}
