import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  makeSelectable,
  Divider,
  FontIcon
} from 'material-ui'
import { connect } from 'redux_state/utils'

import Header from './header.jsx'

import {navItems} from 'routes'

let SelectableList = makeSelectable(List)

let Nav = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  propTypes: {
    open: React.PropTypes.bool.isRequired,
    selected: React.PropTypes.string.isRequired,
    // doLogout: React.PropTypes.func.isRequired,
    showLeftNav: React.PropTypes.func.isRequired,
    hideLeftNav: React.PropTypes.func.isRequired,
    selectItem: React.PropTypes.func.isRequired
  },

  getStyles() {
    return {
      drawerBody: {
        backgroundColor: '#4b132b',
        color: '#ffffff',
        fontWeight: '400',
        width: '80vw',
        maxWidth: '320px',
        transform: this.props.open
          ? 'translateX(0)'
          : 'translateX(-100vw)'
      },
      listSelect: {
        padding: '0px'
      },
      menuItem: {
        color: '#ffffff',
        marginLeft: '10px',
        marginTop: '7px',
        marginBottom: '7px'
      },
      menuItemBottom: {
        color: '#ffffff',
        marginLeft: '10px'
      },
      menuItemIcon: {
        marginLeft: '10px',
        color: '#ffffff'
      },
      menuItemIconActive: {
        marginLeft: '10px',
        color: '#b3c90f'
      },
      menuItemActive: {
        color: '#b3c90f',
        marginLeft: '10px',
        marginTop: '7px',
        marginBottom: '7px'
      },
      menuDivider: {
        backgroundColor: '#633c38',
        opacity: '0.5'
      },
      badgeItem: {
        padding: '0',
        display: 'block'
      },
      badgeNotification: {
        top: '10px',
        right: '20px',
        color: '#4b132b',
        display: 'none'
      },
      graphIcon: {
        height: '26px',
        width: '26px',
        margin: '12px',
        display: 'block',
        position: 'absolute',
        top: '0',
        left: '0px'
      },
      ownIcon: {
        top: '0px',
        left: '4px',
        margin: '12px 12px 12px 10px'
      }
    }
  },

  editProfile(event) {
    this.props.hideLeftNav()
    event.preventDefault()
  },

  goto(url) {
    this.context.router.push(url)
    this.props.hideLeftNav()
  },

  logout() {
    // this.props.doLogout()
    this.goto('/')
  },

  drawerRequestChange(open, reason) {
    if (open) {
      this.props.showLeftNav()
    } else {
      this.props.hideLeftNav()
    }
  },

  renderNavItems() {
    const styles = this.getStyles()
    return navItems.map((item) => {
      let icon
      if (typeof item.icon === 'string') {
        let iconStyle
        if (this.props.selected === item.route) {
          iconStyle = styles.menuItemIconActive
        } else {
          iconStyle = styles.menuItemIcon
        }
        icon = (
          <FontIcon
            style={iconStyle}
            className="material-icons">{item.icon}
          </FontIcon>
        )
      } else {
        let iconStyle
        if (this.props.selected === item.route) {
          iconStyle = '#b3c90f'
        } else {
          iconStyle = '#fff'
        }
        icon = <div style={styles.ownIcon}>
          <item.icon color={iconStyle} />
        </div>
      }

      if (this.props.selected === item.route) {
        return (
          <div key={item.route.toString()}>
            <ListItem
              key={item.route.toString()}
              primaryText={item.title}
              value={item.route}
              onClick={() => this._handleNavChange(item.route)}
              style={styles.menuItemActive}
              leftIcon={icon} />
            <Divider style={styles.menuDivider} />
          </div>
        )
      } else {
        return (
          <div key={item.route.toString()}>
            <ListItem
              key={item.route.toString()}
              primaryText={item.title}
              value={item.route}
              onClick={() => this._handleNavChange(item.route)}
              style={styles.menuItem}
              leftIcon={icon} />
            <Divider style={styles.menuDivider} />
          </div>
        )
      }
    })
  },

  render() {
    const styles = this.getStyles()
    return (
      <Drawer
        ref="drawer"
        docked={false}
        containerStyle={styles.drawerBody}
        open={this.props.open}
        onRequestChange={this.drawerRequestChange}>

        <Header onClose={this.props.hideLeftNav} />
        <div>
          <SelectableList style={styles.listSelect}>
            {this.renderNavItems()}
          </SelectableList>
          <List>
            <ListItem
              key={'signOut'}
              primaryText="Sign out"
              onTouchTap={this.logout}
              style={styles.menuItemBottom}
              leftIcon={
                <FontIcon style={styles.menuItemIcon}
                  className="material-icons">
                exit_to_app </FontIcon>} />
          </List>
          <Divider style={styles.menuDivider} />
        </div>
      </Drawer>
    )
  },

  _handleNavChange(route) {
    this.props.selectItem(route)
    if (route) {
      this.goto(route)
    }
  }
})

export default connect({
  props: ['leftNav.open', 'leftNav.selected'],
  actions: [
    // 'account:doLogout',
    'left-nav:showLeftNav',
    'left-nav:hideLeftNav',
    'left-nav:selectItem'
  ]
})(Nav)
