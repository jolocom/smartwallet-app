import React from 'react'
import classNames from 'classnames'

import {FABButton, Icon} from 'react-mdl'

let FabMenuItem = React.createClass({
  render() {
    let {className, icon, ripple, label, ...otherProps} = this.props

    let classes = classNames('mdl-menu__fab-item', className)

    if (label) {
      label = <span className="mdl-menu__fab-item-label">{label}</span>
    }

    return (
      <div className={classes} {...otherProps}>
        {label}
        <FABButton mini={true} ripple={ripple} colored={true} className="mdl-menu__fab-item-button">
          <Icon name={icon}/>
        </FABButton>
      </div>
    )
  }
})

export default FabMenuItem
