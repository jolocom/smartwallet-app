import React from 'react'

import {FloatingActionButton, FontIcon} from 'material-ui'

let FabMenuItem = React.createClass({
  render() {
    let {icon, label, style, buttonStyle, iconStyle, ...otherProps} = this.props

    if (label) {
      label = <span>{label}</span>
    }

    return (
      <div style={style}>
        <FloatingActionButton mini={true} style={buttonStyle} zDept={1} {...otherProps}>
          <FontIcon className="material-icons" style={iconStyle}>{icon}</FontIcon>
        </FloatingActionButton>
      </div>
    )
  }
})

export default FabMenuItem
