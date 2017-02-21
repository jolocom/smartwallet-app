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
    name: React.PropTypes.string,
    style: React.PropTypes.object
  },

  render() {
    let {imgUrl, name, style} = this.props
    let avatar

    style = style || {}

    if (imgUrl) {
      avatar = (
        <Avatar
          style={Object.assign({
            backgroundSize: 'cover',
            backgroundImage: `url(${Utils.uriToProxied(imgUrl)})`
          }, style)} />
      )
    } else if (name && name.trim() && (name !== 'Unnamed')) {
      let nameInitial = name[0].toUpperCase()
      avatar = <Avatar style={style}>{nameInitial}</Avatar>
    } else {
      avatar = <Avatar style={style} icon={<UserIcon />} />
    }
    return avatar
  }

})

export default Radium(UserAvatar)
