import React from 'react'

import FontIcon from 'material-ui/FontIcon'
import green500 from 'material-ui/styles/colors/green500'

let Verified = React.createClass({
  render() {
    return (
      <FontIcon
        className="material-icons"
        color={green500}
      >
          verified_user
      </FontIcon>
    )
  }
})

export default Verified
