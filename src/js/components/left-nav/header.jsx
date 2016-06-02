import React from 'react'
import Radium from 'radium'

import {IconButton, Avatar} from 'material-ui'

import ProfileActions from 'actions/profile'
import AccountActions from 'actions/account'

let Header = React.createClass({
  contextTypes: {
    profile: React.PropTypes.any
  },
  editProfile() {
    ProfileActions.show()
  },
  logout() {
    AccountActions.logout()
  },
  getStyles() {
    return {
      header: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        padding: '16px'
      },
      profile: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      profileDetails: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      },
      name: {
        fontWeight: 'bold'
      },
      email: {

      }
    }
  },
  render() {
    let initials, {profile} = this.context
    let styles = this.getStyles()
    console.log(this.context)
    if (profile.name)
      initials = profile.name[0]

    return (
      <header style={styles.header}>
        <Avatar src={profile.img}>{initials}</Avatar>
        <div style={styles.profile}>
          <div style={styles.profileDetails}>
            <span style={styles.name}>{profile.name}</span>
            <span style={styles.email}>{profile.email}</span>
          </div>
          <IconButton iconClassName="material-icons" onTouchTap={this.logout}>exit_to_app</IconButton>
          <IconButton iconClassName="material-icons" onTouchTap={this.editProfile}>mode_edit</IconButton>
        </div>
      </header>
    )
  }
})

export default Radium(Header)
