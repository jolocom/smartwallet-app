import React, {Children} from 'react'
import Radium from 'radium'

import {FloatingActionButton, FontIcon} from 'material-ui'

let FabMenu = React.createClass({

  propTypes: {
    children: React.PropTypes.node,
    duration: React.PropTypes.number,
    icon: React.PropTypes.string,
    closeIcon: React.PropTypes.string,
    overlay: React.PropTypes.number,
    onClick: React.PropTypes.func,
    onTouchTap: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      icon: 'add',
      closeIcon: 'clear',
      duration: 0.3
    }
  },

  getInitialState() {
    return {
      open: false
    }
  },

  open() {
    this.setState({open: true})
  },

  close() {
    this.setState({open: false})
  },

  toggle() {
    this.setState({open: !this.state.open})
  },

  calculateTransitionDelays(index) {
    let length = this.props.children.length
    let duration = this.props.duration
    let delta = this.props.duration / length
    let factor = delta * (length - index)
    return {
      appear: factor,
      disappear: duration - factor
    }
  },

  getStyles() {
    let styles = {
      container: {
        position: 'fixed',
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      },
      nav: {
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 4
      },
      item: {
        marginTop: '5px',
        pointerEvents: 'all'
      }
    }
    return styles
  },

  render() {
    let {
      icon,
      closeIcon,
      duration,
      overlay
    } = this.props

    let styles = this.getStyles()

    let children = Children.map(this.props.children, (child, i) => {
      let duration = this.props.duration
      let delays = this.calculateTransitionDelays(i)
      let delay = this.state.open ? delays.disappear : delays.appear
      let show = this.state.open ? 1 : 0
      return React.cloneElement(child, {
        onClick: (...args) => {
          this.setState({open: false})
          if (typeof child.props.onClick === 'function') {
            child.props.onClick(...args)
          }
        },
        secondary: true,
        style: Object.assign({}, {
          transition: `opacity ${duration}s, transform ${duration}s`,
          transitionDelay: `${delay}s`,
          willChange: 'opacity, transform',
          opacity: show,
          transform: `scale(${show}) translate3d(0,0,0)`
        }, styles.item)
      })
    })

    let rotate = this.state.open && closeIcon ? 90 : 0

    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <FloatingActionButton
            onTouchTap={this.toggle}
            style={styles.item}
            iconStyle={{
              transition: `transform ${duration}s`,
              transform: `rotate(${rotate}deg)`
            }}
            secondary
          >
            <FontIcon className="material-icons">
              {this.state.open ? (closeIcon || icon) : icon}
            </FontIcon>
          </FloatingActionButton>
          {children}
        </nav>
        {overlay}
      </div>
    )
  }

})

export default Radium(FabMenu)
