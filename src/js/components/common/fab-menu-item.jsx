import React from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton'

const FabMenuItem = props => {
  let {icon, label, style, buttonStyle, ...otherProps} = props

  if (label) {
    label = <span>{label}</span>
  }

  return (
    <div style={style}>
      <FloatingActionButton mini style={buttonStyle} {...otherProps}>
        {icon}
      </FloatingActionButton>
    </div>
  )
}

FabMenuItem.propTypes = {
  icon: React.PropTypes.any,
  label: React.PropTypes.string,
  style: React.PropTypes.object,
  buttonStyle: React.PropTypes.object,
  iconStyle: React.PropTypes.object
}

export default FabMenuItem
