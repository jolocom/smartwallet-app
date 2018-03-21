import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

const STYLE = {
  padding: '8px 0'
}

const Block = ({style, children, ...props}) => {
  return (
    <div style={Object.assign({}, STYLE, style)} {...props}>
      {children}
    </div>
  )
}

Block.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
}

export default Radium(Block)
