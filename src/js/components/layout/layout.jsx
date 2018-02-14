import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import {theme} from 'styles'
import { connect } from 'redux_state/utils'

@connect({
  props: ['wallet.identityNew'],
  actions: [ ]
})
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
      background:  theme.jolocom.gray1
    }
  };

  render() {
    const style = this.getStyles()
    if (this.props.identityNew.scanningQr.scanning) {
      style.background = 'rgba(0,0,0,0)'
    }

    return (
      <div style={style}>
        {this.props.children}
      </div>
    )
  }
}

export default Radium(Layout)
