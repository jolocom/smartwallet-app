import React from 'react'
import classNames from 'classnames'

import {FABButton, Icon, Tooltip} from 'react-mdl'

let FabMenuItem = React.createClass({
  render() {
    let {className, icon, ripple, tooltip, ...otherProps} = this.props

    let classes = classNames('mdl-menu__fab-item', className)

    let inner
    if (tooltip) {
      inner = <Tooltip label={tooltip}><Icon name={icon}/></Tooltip>
    } else {
      inner = <Icon name={icon}/>
    }

    return (
      <div className={classes} {...otherProps}>
        <FABButton mini={true} ripple={ripple} colored={true}>
          {inner}
        </FABButton>
      </div>
    )
  }
})

export default FabMenuItem
