import React from 'react'

import {FontIcon, Styles} from 'material-ui'

let Verified = React.createClass({
  render() {
    return <FontIcon className="material-icons" color={Styles.Colors.green500}>verified_user</FontIcon>
  }
})

export default Verified
