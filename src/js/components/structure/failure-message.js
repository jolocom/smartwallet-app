import React from 'react'
import PropTypes from 'prop-types';
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
  style: PropTypes.object,
  children: PropTypes.node
}

export default Radium(FailureMessage)
