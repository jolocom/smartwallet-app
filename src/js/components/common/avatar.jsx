import React from 'react'
import classNames from 'classnames'

let Avatar = React.createClass({
  render() {
    let classes, style, {src, className} = this.props

    classes = classNames('jlc-avatar', className)

    if (src) {
      style.backgroundImage = 'url(${this.props.src})'
    }

    return (
      <div className={classes} style={style}>{this.props.children}</div>
    )
  }
})

export default Avatar
