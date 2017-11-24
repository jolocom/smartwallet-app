import React from 'react'
import Radium from 'radium'
import Badge from 'material-ui/Badge'
import IconButton from 'material-ui/IconButton'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'

import { connect } from 'redux_state/utils'

@connect({
  actions: ['left-nav:showLeftNav']
})
@Radium
export default class LeftNavToggle extends React.Component {
  static propTypes = {
    showLeftNav: React.PropTypes.func.isRequired
  }
  render() {
    const styles = {
      menuIcon: {
        cursor: 'pointer'
      },
      navBadge: {
        padding: 0
      },
      hamburgerBadge: {
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        display: 'none'
      }
    }

    return (
      <Badge
        badgeContent={''}
        secondary
        style={styles.navBadge}
        badgeStyle={styles.hamburgerBadge}>
        <IconButton
          onTouchTap={this._handleShowDrawer}
        >
          <NavigationMenu
            style={styles.menuIcon} />
        </IconButton>
      </Badge>
    )
  }

  _handleShowDrawer = () => {
    this.props.showLeftNav()
  }
}
