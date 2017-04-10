import React from 'react'
import Radium from 'radium'

const STYLE = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '2%'
}

const Content = ({style, children, ...props}) => {
  return (
    <div style={Object.assign({}, STYLE, style)} {...props}>
      {children}
    </div>
  )
}

Content.propTypes = {
  children: React.PropTypes.node,
  style: React.PropTypes.object
}

export default Radium(Content)
