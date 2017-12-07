import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

const STYLE = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1
}

const Content = ({style, children, ...props}) => {
  return (
    <div style={Object.assign({}, STYLE, style)} {...props}>
      {children}
    </div>
  )
}

Content.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
}

export default Radium(Content)
