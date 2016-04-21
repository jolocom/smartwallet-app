import React from 'react'

import {Checkbox} from 'material-ui'

export default React.createClass({
  contextTypes: {
    muiTheme: React.PropTypes.any
  },
  render() {
    let {style, icon, ...checkboxProps} = this.props

    return (
      <div style={style}>
        <Checkbox checkedIcon={icon} uncheckedIcon={icon} {...checkboxProps}/>
      </div>
    )
  }
})
