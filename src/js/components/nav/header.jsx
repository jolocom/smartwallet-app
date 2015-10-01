import React from 'react'
import Reflux from 'reflux'

import {IconButton} from 'react-mdl'

import Avatar from 'components/avatar.jsx'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

let Header = React.createClass({
  mixins: [
    Reflux.connect(ProfileStore, 'profile')
  ],
  componentWillMount() {
    ProfileActions.load()
  },
  render() {
    let {profile} = this.state
    let initials = profile.name[0]
    return (
      <header className="jlc-nav-header">
        <Avatar src={profile.img}>{initials}</Avatar>
        <div className="jlc-nav-profile">
          <div className="jlc-nav-profile-details">
            <span className="jlc-nav-profile-name">{profile.name}</span>
            <span className="jlc-nav-profile-email">{profile.email}</span>
          </div>
          <IconButton name="mode_edit"/>
        </div>
      </header>
    )
  }
})

export default Header
