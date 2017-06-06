import Reflux from 'reflux'
import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  makeSelectable,
  Divider,
  FontIcon
  // Avatar
} from 'material-ui'
import { connect } from 'redux/utils'

import Header from './header.jsx'

// import UserAvatar from 'components/common/user-avatar.jsx'

import accountActions from 'actions/account'

import ProfileStore from 'stores/profile'

import {navItems} from 'routes'

let SelectableList = makeSelectable(List)

let Nav = React.createClass({

  mixins: [
    Reflux.connect(ProfileStore, 'profile')
  ],

  contextTypes: {
    router: React.PropTypes.object,
    profile: React.PropTypes.any
  },

  propTypes: {
    open: React.PropTypes.bool.isRequired,
    selected: React.PropTypes.string.isRequired,
    doLogout: React.PropTypes.func.isRequired,
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
      menuItem: {
        color: '#ffffff',
        marginLeft: '10px'
      },
      menuItemIcon: {
        marginLeft: '10px',
        color: '#ffffff'
      },
      menuItemIconActive: {
        color: '#b3c90f'
      },
      menuItemActive: {
        color: '#b3c90f',
        marginLeft: '10px'
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
      }
    }
  },

  editProfile(event) {
    this.props.hideLeftNav()
    this.context.router.push('profile')
    event.preventDefault()
  },

  goto(url) {
    this.context.router.push(url)
    this.props.hideLeftNav()
  },

  logout() {
    this.props.doLogout()
    // Reflux signal, so reflux components can update.
    accountActions.logout()
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
        icon = (
          <FontIcon
            style={styles.menuItemIconActive}
            className="material-icons">{item.icon}
          </FontIcon>
        )
      } else {
        icon = <item.icon />
      }

      return (
        <ListItem
          key={item.route}
          primaryText={item.title}
          onTouchTap={this.hide}
          value={item.route}
          style={styles.menuItemActive}
          leftIcon={icon}
        />
      )
    })
  },

  render() {
    // let initials, {profile} = this.context
    // let name = profile.givenName ? profile.givenName : profile.fullName
    // if (name) {
    //   initials = name[0]
    // }
    const styles = this.getStyles()
    return (
      <Drawer
        ref="drawer"
        docked={false}
        containerStyle={styles.drawerBody}
        open={this.props.open}
        onRequestChange={this.drawerRequestChange}
        >
        <Header onClose={this.props.hideLeftNav} />
        <div>
          <SelectableList
            value={this.props.selected}
            onChange={this._handleNavChange}
          >
            {this.renderNavItems()}
          </SelectableList>
          <Divider style={styles.menuDivider} />
          <List>
            <ListItem primaryText="Sign out"
              onTouchTap={this.logout}
              style={styles.menuItem}
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

  _handleNavChange(event, selected) {
    this.props.selectItem(selected || '')
    if (selected) {
      this.goto(selected)
    }
  }
})

export default connect({
  props: ['leftNav.open', 'leftNav.selected'],
  actions: [
    'account:doLogout',
    'left-nav:showLeftNav',
    'left-nav:hideLeftNav',
    'left-nav:selectItem'
  ]
})(Nav)
