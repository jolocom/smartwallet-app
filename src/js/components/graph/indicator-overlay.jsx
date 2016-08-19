// This file defines the indicator overlay component - the popup that appears on
//  on the device screen the first time a user's graph exceeds the max visible
//  nodes, and illustrates the gesture to use to scroll the graph.
import React from 'react'
import Radium from 'radium'

let IndicatorOverlay = React.createClass({

  getInitialState() {
    return {
      visible: false // overlay is initially hidden
    }
  },

  getStyles() {
    return {
      // CSS for the overlay
      overlayContainer: {
        position: 'fixed',
        zIndex: 1300,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        backgroundImage: 'url(/img/indicator-overlay.png)',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        textAlign: 'center',
        display: 'block',
        transition: 'display 1s',
        marginTop: '-112px',
        pointerEvents: 'none'
      },
      // CSS for hidden overlay
      overlayContainerHidden: {
        display: 'none'
      }
    }
  },

  // hides overlay
  hide() {
    this.setState({visible: false})
  },

  // displays overlay, only when not already previously shown
  show() {
    if (!localStorage.getItem('littlesister.onboarding.scrolling-indicator')) {
      this.setState({visible: true})
      localStorage.setItem('littlesister.onboarding.scrolling-indicator', true)
    }
  },

  // toggles show/hide overlay
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
      // When hiding overlay, change 'style' to overlayContainerHidden so that
      // 'display' is overriden
      style = Object.assign({}, style, styles.overlayContainerHidden)
    }

    // onTouchTap={this._handleClick}
    return (
      <div style={style}>
      </div>
    )
  },

  _handleClick(e) {
    this.hide()
  }

})

export default Radium(IndicatorOverlay)
