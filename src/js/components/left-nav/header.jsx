import React from 'react'
import Radium from 'radium'

import {IconButton, Avatar} from 'material-ui'

import ProfileActions from 'actions/profile'

let Header = React.createClass({
  contextTypes: {
    profile: React.PropTypes.any,
    muiTheme: React.PropTypes.object
  },
  editProfile() {
    ProfileActions.show()
  },
  getStyles() {
    return {
      header: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        padding: '16px',
        backgroundColor: this.context.muiTheme.jolocom.gray4,
        borderBottom: `1px solid ${this.context.muiTheme.palette.borderColor}`
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
        fontSize: '12px'
      }
    }
  },
  render() {
    let initials, {profile} = this.context
    let name = profile.givenName ? profile.givenName : profile.fullName

    let styles = this.getStyles()
    if (name)
      initials = name[0]
    return (
      <header style={styles.header}>
        <Avatar>{initials}</Avatar>
        <div style={styles.profile}>
          <div style={styles.profileDetails}>
            <span style={styles.name}>{name}</span>
            <span style={styles.email}>{profile.email}</span>
          </div>
          <IconButton iconClassName="material-icons" onTouchTap={this.editProfile}>mode_edit</IconButton>
        </div>
      </header>
    )
  }
})

export default Radium(Header)
