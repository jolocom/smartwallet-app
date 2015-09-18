import React from 'react'
import Reflux from 'reflux'

import {Avatar, Card, CardHeader} from 'material-ui'

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

    return (
      <Card>
        <CardHeader
          title={profile.name}
          subtitle={profile.email}
          avatar={<Avatar>A</Avatar>}/>
      </Card>
    )
  }
})

export default Header
