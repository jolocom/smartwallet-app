import React from 'react'
import Radium from 'radium'

const STYLE = {
  color: 'red'
}

const FailureMessage = ({style, children, ...props}) => {
  return (
    <div style={Object.assign({}, STYLE, style)} >
      {children}
    </div>
  )
}

FailureMessage.propTypes = {
  style: React.PropTypes.object,
  children: React.PropTypes.node
}

export default Radium(FailureMessage)
