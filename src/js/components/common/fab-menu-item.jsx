import React from 'react'
import classNames from 'classnames'

import {FloatingActionButton, FontIcon} from 'material-ui'

let FabMenuItem = React.createClass({
  render() {
    let {className, icon, label, style, buttonStyle, iconStyle, ...otherProps} = this.props

    let classes = classNames('mdl-menu__fab-item', className)

    if (label) {
      label = <span className="mdl-menu__fab-item-label">{label}</span>
    }

    return (
      <div className={classes} style={style}>
        <FloatingActionButton mini={true} style={buttonStyle} zDept={1} {...otherProps}>
          <FontIcon className="material-icons" style={iconStyle}>{icon}</FontIcon>
        </FloatingActionButton>
      </div>
    )
  }
})

export default FabMenuItem
