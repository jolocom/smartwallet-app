import React from 'react'
import Radium from 'radium'

const STYLE = {
  position: 'relative',
  display: 'inline',
  flexDirection: 'column',
  alignItems: 'left',
  textAlign: 'left',
  boxSizing: 'border-box',
  minHeight: '100%',
  minWidth: '300px',
  width: '100%'
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
