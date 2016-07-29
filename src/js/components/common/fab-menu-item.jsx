import React from 'react'

import {FloatingActionButton, FontIcon} from 'material-ui'

class FabMenuItem extends React.Component {

  static propTypes = {
    icon: React.PropTypes.string,
    label: React.PropTypes.string,
    style: React.PropTypes.object,
    buttonStyle: React.PropTypes.object,
    iconStyle: React.PropTypes.object
  }

  render() {
    let {icon, label, style, buttonStyle, iconStyle, ...otherProps} = this.props

    if (label) {
      label = <span>{label}</span>
    }

    return (
      <div style={style}>
        <FloatingActionButton mini style={buttonStyle} {...otherProps}>
          <FontIcon className="material-icons" style={iconStyle}>
            {icon}
          </FontIcon>
        </FloatingActionButton>
      </div>
    )
  }
}

export default FabMenuItem
