import React from 'react'
import Radium from 'radium'

import {
  Avatar
} from 'material-ui'

import UserIcon from 'material-ui/svg-icons/action/face'

import Utils from 'lib/util'

let UserAvatar = React.createClass({

  propTypes: {
    imgUrl: React.PropTypes.any,
    name: React.PropTypes.string
  },

  getInitialState() {
    return {
    }
  },

  getStyles() {
    return {
    }
  },

  render() {
    let imgUrl = this.props.imgUrl
    let name = this.props.name

    let avatar

    if (imgUrl) {
      avatar =
        <Avatar
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url(${Utils.uriToProxied(imgUrl)})`
          }} />
    } else if (name && name.trim()) {
      let nameInitial = name[0].toUpperCase()
      avatar = <Avatar>{nameInitial}</Avatar>
    } else {
      avatar = <Avatar icon={<UserIcon />} />
    }

    return (
      avatar
    )
  }

})

export default Radium(UserAvatar)
