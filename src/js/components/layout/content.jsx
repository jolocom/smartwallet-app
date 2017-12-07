import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import extend from 'lodash/extend'

class Content extends React.Component {
  static propTypes = {
    style: PropTypes.string,
    children: PropTypes.node
  };

  getStyles = () => {
    return {
      width: '100%',
      maxWidth: '1200px',
      margin: 'auto',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      backgroundColor: '#fff'
    }
  };

  render() {
    let styles = this.getStyles()

    let {style} = this.props

    if (style) {
      extend(styles, style)
    }

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    )
  }
}

export default Radium(Content)
