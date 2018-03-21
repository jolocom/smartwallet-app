import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

const STYLE = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  textAlign: 'left',
  padding: '0px',
  boxSizing: 'border-box',
  minHeight: '100%'
}

const TabContainer = ({style, children, ...props} = {}) => {
  return (
    <div style={Object.assign({}, STYLE, style)} {...props}>
      {children}
    </div>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
}

export default Radium(TabContainer)
