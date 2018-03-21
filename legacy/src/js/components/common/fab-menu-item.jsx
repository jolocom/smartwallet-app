import PropTypes from 'prop-types';
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
  icon: PropTypes.any,
  label: PropTypes.string,
  style: PropTypes.object,
  buttonStyle: PropTypes.object,
  iconStyle: PropTypes.object
}

export default FabMenuItem
