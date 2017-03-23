import React from 'react'
import Radium from 'radium'

import {Checkbox} from 'material-ui'

export default Radium(React.createClass({
  contextTypes: {
    muiTheme: React.PropTypes.any
  },
  propTypes: {
    style: React.PropTypes.object,
    checkboxStyle: React.PropTypes.object,
    icon: React.PropTypes.object
  },
  render() {
    let {style, checkboxStyle, icon, ...checkboxProps} = this.props

    return (
      <div style={style}>
        <Checkbox
          checkedIcon={icon}
          uncheckedIcon={icon}
          style={checkboxStyle}
          {...checkboxProps}
        />
      </div>
    )
  }
}))
