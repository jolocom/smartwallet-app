import React from 'react'
import Radium from 'radium'

import {IconMenu, MenuItem, IconButton} from 'material-ui'

let IndicatorOverlay = React.createClass({

  getInitialState: function() {
    return { isHidden: true };
  },

  getStyles: function(){
    let styles = {
      overlayContainer: {
          position: 'absolute',
          zIndex: 1500,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          opacity: '0.7'
      },
      indicatorImg: {
        color: 'yellow'
      }
    }

    return styles
  },

  _handleClose: function() {
    this.setState({isHidden: false});
  },

  render: function() {
    let styles = this.getStyles()

    return (
      <div>
      { !this.state.isHidden ? null : (
        <div style={styles.overlayContainer} onTouchTap={this._handleClose}>
          <h1 style={styles.indicatorImg}>HELOOOOOOO</h1>
        </div>
      )}
      </div>
    );
  }

})

export default Radium(IndicatorOverlay)
