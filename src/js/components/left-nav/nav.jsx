import Reflux from 'reflux'
import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  makeSelectable,
  Divider,
  FontIcon,
  Avatar
} from 'material-ui'
import { connect } from 'redux/utils'

import Header from './header.jsx'

import UserAvatar from 'components/common/user-avatar.jsx'
import GraphIcon from 'components/icons/graph-icon.jsx'

import ProfileStore from 'stores/profile'
import Badge from 'material-ui/Badge'

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
    hideLeftNav: React.PropTypes.func.isRequired
  },

  getStyles() {
    return {
      drawerBody: {
        backgroundColor: '#4b132b',
        color: '#ffffff',
        fontWeight: '400',
        width: '80vw',
        transform: this.props.open
          ? 'translateX(0)'
          : 'translateX(-100vw)'
        // width: 0.8 * window.innerWidth,
        // transform: this.refs.drawer
        // ? `translate3d(${this.refs.drawer.state.open ? 0
        //   : -(this.refs.drawer.getMaxTranslateX() + 40)}px, 0, 0)`
        //   : '0px'
        // transform: `translate3d(${this.refs.drawer.state.open ? 0
        //   : this.refs.drawer.getMaxTranslateX()}px, 0, 0)`
      },
      menuItem: {
        color: '#ffffff',
        marginLeft: '10px'
      },
      menuItemIcon: {
        marginLeft: '10px',
        color: '#ffffff'
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
  },

  drawerRequestChange(open, reason) {
    if (open) {
      this.props.showLeftNav()
    } else {
      this.props.hideLeftNav()
    }
  },

  render() {
    // let initials, {profile} = this.context
    // let name = profile.givenName ? profile.givenName : profile.fullName
    // if (name) {
    //   initials = name[0]
    // }
    let styles = this.getStyles()
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
            onChange={this._handleNavChange}>
            <Badge
              badgeContent={10}
              secondary style={styles.badgeItem}
              badgeStyle={styles.badgeNotification}>
              {/** TODO: make selection style dynamic **/}
              <ListItem primaryText="Graph"
                onTouchTap={this.hide}
                value="graph"
                style={styles.menuItemActive}
                leftIcon={
                  <FontIcon
                    style={styles.menuItemIcon}
                    className="material-icons" />}>
                <GraphIcon style={styles.graphIcon} />
              </ListItem>
            </Badge>
          </SelectableList>
          <Divider style={styles.menuDivider} />
          <SelectableList
            value={this.props.selected}
            onChange={this._handleNavChange}
            >
            <ListItem primaryText="Profile"
              onTouchTap={this.editProfile}
              style={styles.menuItem}
              leftAvatar={
                <Avatar
                  style={{marginLeft: '-10px'}}>
                  <UserAvatar
                    name={this.state.profile.givenName
                      ? this.state.profile.givenName
                      : this.state.profile.fullName
                    }
                    imgUrl={this.state.profile.imgUri} />
                </Avatar>}
            />
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
    /* this.setState({selected})
    this.goto(`/${selected}`) */
  }

})

export default connect({
  props: ['leftNav.open', 'leftNav.selected'],
  actions: ['account:doLogout', 'left-nav:showLeftNav', 'left-nav:hideLeftNav']
})(Nav)
