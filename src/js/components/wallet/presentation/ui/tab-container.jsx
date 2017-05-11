import React from 'react'
import Radium from 'radium'

const STYLE = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  textAlign: 'left',
  padding: '0px',
  boxSizing: 'border-box',
  overflowY: 'auto',
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
  children: React.PropTypes.node,
  style: React.PropTypes.object
}

export default Radium(TabContainer)
