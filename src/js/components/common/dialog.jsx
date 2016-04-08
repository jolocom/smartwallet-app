import React from 'react'
import Radium from 'radium'

let Dialog = React.createClass({

  getInitialState() {
    return {
      visible: this.props.visible
    }
  },

  getStyles() {
    return {
      container: {

      },
      fullscreen: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 10,
        opacity: 0,
        transform: 'translate(0, 100%)',
        transition: 'opacity .3s, transform .3s'
      },
      visible: {
        opacity: 1,
        transform: 'translate(0, 0)'
      }
    }
  },

  show() {
    this.setState({visible: true})
  },

  hide() {
    this.setState({visible: false})
  },

  toggle() {
    this.setState({visible: !this.state.open})
  },

  render() {
    let styles = this.getStyles()

    let {style, fullscreen} = this.props
    let {visible} = this.state

    return (
      <div
        style={[
          styles.container,
          style,
          fullscreen && styles.fullscreen,
          visible && styles.visible
        ]}>
        {this.props.children}
      </div>
    )
  }

})

export default Radium(Dialog)
