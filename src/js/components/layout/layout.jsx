import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import {theme} from 'styles'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  getStyles = () => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: theme.jolocom.gray1
    }
  };

  render() {
    return (
      <div style={this.getStyles()}>
        {this.props.children}
      </div>
    )
  }
}

export default Radium(Layout)
