import React from 'react'
import classNames from 'classnames'

export default React.createClass({
  render() {
    let {className} = this.props

    let classes = classNames('jlc-list', className)

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    )
  }
})

export let ListGroup = React.createClass({
  render() {
    let {className, title} = this.props

    let classes = classNames('jlc-list-group', className)

    if (title) {
      title = <div className="jlc-list-group-title">{title}</div>
    }

    return (
      <div className={classes}>
        {title}
        {this.props.children}
      </div>
    )
  }
})

export let ListItem = React.createClass({
  render() {
    let {className, title, content, leftIcon} = this.props

    let classes = classNames('jlc-list-item', className)

    return (
      <div className={classes}>
        <div className="jlc-list-item-inner">
          <div className="jlc-list-item-title">{title}</div>
          <div className="jlc-list-item-content">{content}</div>
        </div>
        {leftIcon ?
          React.cloneElement(leftIcon, {className: 'jlc-list-item-left-icon'})
          : null}
      </div>
    )
  }
})
