import React from 'react'
import Radium from 'radium'

import {IconMenu, MenuItem, IconButton} from 'material-ui'

import PersonIcon from 'material-ui/svg-icons/social/person'
import LocationIcon from 'material-ui/svg-icons/maps/place'
import EventIcon from 'material-ui/svg-icons/action/event'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import IconToggle from 'components/common/icon-toggle.jsx'

const filters = {
  people: {
    icon: PersonIcon
  },
  locations: {
    icon: LocationIcon
  },
  events: {
    icon: EventIcon
  }
}

class Filters extends React.Component {

  state = {
    show: false,
    filters: {}
  }

  static propTypes = {
    style: React.PropTypes.object,
    showDefaults: React.PropTypes.bool
  }

  static contextTypes = {
    muiTheme: React.PropTypes.object
  }

  getStyles() {
    const theme = this.context.muiTheme

    const styles = {
      container: {
        display: 'flex'
      },
      filters: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      item: {
        textAlign: 'center',
        padding: '2px 18px',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        marginLeft: '8px',
        borderRadius: '28px'
      },
      itemActive: {
        backgroundColor: theme.palette.primary1Color
      },
      icon: {
        marginRight: 0,
        left: '50%',
        marginLeft: '-12px',
        fill: 'rgba(0, 0, 0, 0.24)'
      },
      iconActive: {
        marginRight: 0,
        left: '50%',
        marginLeft: '-12px',
        fill: '#ffffff'
      }
    }

    return styles
  }

  toggleFilter(name) {
    let filters = this.state.filters

    if (filters[name]) {
      delete filters[name]
    } else {
      filters[name] = true
    }

    this.setState({filters})
  }

  getFilter(id) {
    const styles = this.getStyles()
    const filter = filters[id]
    const checked = this.state.filters[id]

    return (<IconToggle
      icon={<filter.icon />}
      style={[styles.item, checked && styles.itemActive]}
      id={id}
      checked={checked}
      iconStyle={checked ? styles.iconActive : styles.icon}
      onCheck={() => {this.toggleFilter(id)}} />
    )
  }

  render() {
    const styles = this.getStyles()
    const {style, showDefaults} = this.props
    let defaultFilters

    if (showDefaults) {
      defaultFilters = (
        <nav style={styles.filters}>
          {this.getFilter('people')}
          {this.getFilter('locations')}
          {this.getFilter('events')}
        </nav>
      )
    }

    return (
      <div style={[styles.container, style]}>
        {defaultFilters}
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText="Show only" disabled />
          <MenuItem primaryText="People" leftIcon={<PersonIcon />} />
          <MenuItem primaryText="Locations" leftIcon={<LocationIcon />} />
          <MenuItem primaryText="Events" leftIcon={<EventIcon />} />
        </IconMenu>
      </div>
    )
  }

}

export default Radium(Filters)
