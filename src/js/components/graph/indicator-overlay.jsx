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
        backgroundColor: '#000',
        opacity: '0.7',
        textAlign: 'center',
        display: 'block',
        transition: 'display 1s',
        marginTop: '-112px'
      },
      // CSS for hidden overlay
      overlayContainerHidden: {
        display: 'none'
      },
      // white text/arrow illustration within overlay
      indicatorImg: {
        position: 'relative',
        top: '80vh'
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

    return (
      <div style={style} onTouchTap={this._handleClick}>
        <img style={styles.indicatorImg} src="/img/indicator-overlay.png" />
      </div>
    )
  },

  _handleClick(e) {
    // Prevents the onClick event from triggering on the nodes
    e.preventDefault()
    e.stopPropagation()

    this.hide()
  }

})

export default Radium(IndicatorOverlay)
