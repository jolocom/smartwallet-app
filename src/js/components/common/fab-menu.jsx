import React, {Children} from 'react'
import Radium from 'radium'

import _ from 'lodash'

import {FloatingActionButton, FontIcon} from 'material-ui'

let FabMenu = React.createClass({

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
        right: '0',
        bottom: '0'
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
        marginTop: '5px'
      }
    }
    return styles
  },

  render() {
    let {
      ripple,
      icon,
      // closeIcon,
      // zIndex,
      overlay,
      ...otherProps
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
          if (typeof child.props.onClick === 'function')
            child.props.onClick(...args)
        },
        style: _.extend({
          transition: `opacity ${duration}s, transform ${duration}s`,
          transitionDelay: `${delay}s`,
          willChange: 'opacity, transform',
          opacity: show,
          transform: `scale(${show})`
        }, styles.item)
      })
    })

    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <FloatingActionButton onClick={this.toggle} style={styles.item}>
            <FontIcon className="material-icons">{icon}</FontIcon>
          </FloatingActionButton>
          {children}
        </nav>
        {overlay}
      </div>
    )
  }

})

export default Radium(FabMenu)
