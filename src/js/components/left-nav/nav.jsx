import Reflux from 'reflux'
import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  MakeSelectable,
  Divider,
  FontIcon,
  Avatar
} from 'material-ui'
import Header from './header.jsx'

import AccountActions from 'actions/account'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'
import Badge from 'material-ui/Badge'
import Util from 'lib/util'

let SelectableList = MakeSelectable(List)

let Nav = React.createClass({

  mixins: [
    Reflux.connect(ProfileStore, 'profile')
  ],

  contextTypes: {
    router: React.PropTypes.object,
    profile: React.PropTypes.any
  },

  getInitialState() {
    return {
      selected: 'graph',
      drawerOpen: false
    }
  },

  getStyles() {
    return {
      drawerBody: {
        backgroundColor: '#4b132b',
        color: '#ffffff',
        fontWeight: '400',
        width: '80vw',
        transform: this.state.drawerOpen
          ? 'translateX(0)'
          : 'translateX(-80vw)'
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
        marginLeft: '-10px'
      },
      menuItemIcon: {
        marginLeft: '30px',
        color: '#ffffff'
      },
      menuItemActive: {
        color: '#b3c90f',
        marginLeft: '-10px'
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
        left: '20px'
      }
    }
  },

  moveDrawer() {
    // manually move the drawer to 80% ?
  },

  show() {
    this.setState({drawerOpen: true})
  },

  hide() {
    this.setState({drawerOpen: false})
  },

  editProfile() {
    ProfileActions.show()
  },

  goto(url) {
    this.context.router.push(url)
    this.setState({drawerOpen: false})
  },

  logout() {
    AccountActions.logout()
  },

  drawerRequestChange(open,reason) {
    this.setState({drawerOpen: open})
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
        open={this.state.drawerOpen}
        onRequestChange={this.drawerRequestChange}
        >
        <Header onClose={this.hide} />
        <div>
          <SelectableList
            value={this.state.selected}
            onChange={this._handleNavChange}>
            <Badge
              badgeContent={10}
              secondary style={styles.badgeItem}
              badgeStyle={styles.badgeNotification}>
              {/** TODO: make selection style dynamic **/}
              <ListItem primaryText="Little Sister"
                onTouchTap={this.hide}
                value="graph"
                style={styles.menuItemActive}
                leftIcon={
                  <FontIcon
                    style={styles.menuItemIcon}
                    className="material-icons" />}>
                <img style={styles.graphIcon}
                  src="/img/ic_littleSister_menu.png" />
              </ListItem>
            </Badge>
          </SelectableList>
          <Divider style={styles.menuDivider} />
          <SelectableList
            value={this.state.selected}
            onChange={this._handleNavChange}>
            <ListItem primaryText="Profile"
              onTouchTap={this.editProfile}
              style={styles.menuItem}
              leftIcon={
                this.state.profile.imgUri
                ? <Avatar
                  style={styles.menuItemIcon}
                  src={Util.uriToProxied(this.state.profile.imgUri)} />
                : <FontIcon
                  style={styles.menuItemIcon}
                  className="material-icons">
                    account_circle
                </FontIcon>}
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
    this.setState({selected})
    this.goto(`/${selected}`)
  }

})

export default Nav
