import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'

const STYLE = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  height: '100%',
  padding: '16px',
  backgroundColor: theme.jolocom.gray4,
  boxSizing: 'border-box'
}

const Container = ({style, children, ...props} = {}) => {
  return (
    <div style={Object.assign({}, STYLE, style)} {...props}>
      {children}
    </div>
  )
}

Container.propTypes = {
  children: React.PropTypes.node,
  style: React.PropTypes.object
}

export default Radium(Container)
