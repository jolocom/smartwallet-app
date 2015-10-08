import React from 'react'

let Avatar = React.createClass({
  render() {
    let style = {}
    if (this.props.src) {
      style.backgroundImage = 'url(${this.props.src})'
    }
    return (
      <div className="jlc-avatar" style={style}>{this.props.children}</div>
    )
  }
})

export default Avatar
