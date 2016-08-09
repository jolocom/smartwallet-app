import React from 'react'
import Radium from 'radium'

import {IconMenu, MenuItem, IconButton} from 'material-ui'

let IndicatorOverlay = React.createClass({

  getInitialState() {
    return {
      visible: false
    }
  },

  getStyles() {
    return {
      overlayContainer: {
          position: 'absolute',
          zIndex: 1500,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          opacity: '0.7',
          textAlign: 'center',
          display: 'block',
          transition: 'display 1s',
          marginTop: '-112px'
      },
      overlayContainerHidden: {
          display: 'none'
      },
      indicatorImg: {
        position: 'relative',
        top: '80vh'
      }
    }
  },

  hide() {
    this.setState({visible: false})
  },

  show() {
    if (!localStorage.getItem('indicator-overlay-drawn')) {
      this.setState({visible: true})
      localStorage.setItem('indicator-overlay-drawn', true)
    }
  },

  toggle() {
    if (this.state.visible) {
      this.hide()
    } else {
      this.show()
    }
  },

  render() {
    let styles = this.getStyles()

    let style = styles.overlayContainer

    if (!this.state.visible) {
      style = Object.assign({}, style, styles.overlayContainerHidden)
    }

    return (
      <div style={style} onTouchTap={this.hide}>
        <img style={styles.indicatorImg} src="/img/scroll_indicator_overlay2.png"/>
      </div>
    );
  }

})

export default Radium(IndicatorOverlay)
