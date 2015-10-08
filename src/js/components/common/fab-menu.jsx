import React, {Children} from 'react'
import classNames from 'classnames'

import {FABButton, Icon, Tooltip} from 'react-mdl'

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

  render() {
    let {
      className,
      ripple,
      icon,
      // closeIcon,
      // zIndex,
      overlay,
      ...otherProps
    } = this.props

    let classes = classNames('mdl-menu__fab', {
      'is-opened': this.state.open
    }, className)

    let children = Children.map(this.props.children, (child, i) => {
      let duration = this.props.duration
      let delays = this.calculateTransitionDelays(i)
      let delay = this.state.open ? delays.disappear : delays.appear
      let show = this.state.open ? 1 : 0
      return React.cloneElement(child, {
        className: classNames('mdl-menu__fab-item', child.props.className),
        style: {
          transition: `opacity ${duration}s, transform ${duration}s`,
          transitionDelay: `${delay}s`,
          willChange: 'opacity, transform',
          opacity: show,
          transform: `scale(${show})`
        }
      })
    })

    return (
      <div className={classes}>
        <nav className="mdl-menu__fab-nav">
          <FABButton accent={true} ripple={ripple} onClick={this.toggle}>
            <Tooltip label="blaat">
              <Icon name={icon}/>
            </Tooltip>
          </FABButton>
          {children}
        </nav>
        {overlay}
      </div>
    )
  }

})

export default FabMenu
