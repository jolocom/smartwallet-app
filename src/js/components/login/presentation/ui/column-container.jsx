import React from 'react'
import Radium from 'radium'

const STYLE = {
  width: '400px',
  maxWidth: '80%'
}

const ColumnContainer = ({style, children, ...props}) => {
  return (
    <div style={Object.assign({}, STYLE, style)} {...props}>
      {children}
    </div>
  )
}

ColumnContainer.propTypes = {
  children: React.PropTypes.node,
  style: React.PropTypes.object
}

export default Radium(ColumnContainer)
