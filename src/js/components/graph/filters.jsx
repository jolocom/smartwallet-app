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
    const {filters} = this.context.muiTheme

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
        backgroundColor: filters.itemColor,
        marginLeft: '8px',
        borderRadius: '28px'
      },
      itemActive: {
        backgroundColor: filters.activeItemColor
      },
      icon: {
        marginRight: 0,
        left: '50%',
        marginLeft: '-12px',
        fill: filters.iconColor
      },
      iconActive: {
        marginRight: 0,
        left: '50%',
        marginLeft: '-12px',
        fill: filters.activeIconColor
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
    const toggle = () => {
      this.toggleFilter(id)
    }
    return (<IconToggle
      icon={<filter.icon />}
      style={[styles.item, checked && styles.itemActive]}
      id={id}
      checked={checked}
      iconStyle={checked ? styles.iconActive : styles.icon}
      onCheck={toggle} />
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
      <div style={Object.assign({}, styles.container, style)}>
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
