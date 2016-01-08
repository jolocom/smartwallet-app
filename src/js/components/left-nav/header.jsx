import React from 'react'

import {IconButton} from 'material-ui'

import Avatar from 'components/common/avatar.jsx'

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
  render() {
    let initials, {profile} = this.context

    if (profile.name)
      initials = profile.name[0]

    return (
      <header className="jlc-nav-header">
        <Avatar src={profile.img}>{initials}</Avatar>
        <div className="jlc-nav-profile">
          <div className="jlc-nav-profile-details">
            <span className="jlc-nav-profile-name">{profile.name}</span>
            <span className="jlc-nav-profile-email">{profile.email}</span>
          </div>
          <IconButton iconClassName="material-icons" onTouchTap={this.logout}>exit_to_app</IconButton>
          <IconButton iconClassName="material-icons" onTouchTap={this.editProfile}>mode_edit</IconButton>
        </div>
      </header>
    )
  }
})

export default Header
