import React from 'react'
import Radium from 'radium'

import {
  Avatar
} from 'material-ui'

import UserIcon from 'material-ui/svg-icons/action/face'

import Utils from 'lib/util'

let UserAvatar = React.createClass({

  propTypes: {
    imgUrl: React.PropTypes.any, // TODO change type to something more precise
    name: React.PropTypes.string
  },

  render() {
    let imgUrl = this.props.imgUrl
    // let name = this.props.name

    let avatar

    if (imgUrl) {
      // User has display image
      avatar = (
        <Avatar
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url(${Utils.uriToProxied(imgUrl)})`
          }} />
      )
    }
    // else if (name && name.trim() && (name !== 'Unnamed')) {
    //   // User has no display image but has a non-empty name
    //   let nameInitial = name[0].toUpperCase()
    //   avatar = <Avatar>{nameInitial}</Avatar>
    // }
    else {
      // User has no image and no specified name
      avatar = <Avatar icon={<UserIcon />} />
    }
    return avatar
  }

})

export default Radium(UserAvatar)
