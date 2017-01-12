import React from 'react'

import {FloatingActionButton} from 'material-ui'

class FabMenuItem extends React.Component {

  static propTypes = {
    icon: React.PropTypes.any,
    label: React.PropTypes.string,
    style: React.PropTypes.object,
    buttonStyle: React.PropTypes.object,
    iconStyle: React.PropTypes.object
  }

  render() {
    let {icon, label, style, buttonStyle, ...otherProps} = this.props

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
}

export default FabMenuItem
