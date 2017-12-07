import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import Checkbox from 'material-ui/Checkbox'

export default Radium(class extends React.Component {
  static contextTypes = {
    muiTheme: PropTypes.any
  };

  static propTypes = {
    style: PropTypes.object,
    checkboxStyle: PropTypes.object,
    icon: PropTypes.object
  };

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
});
