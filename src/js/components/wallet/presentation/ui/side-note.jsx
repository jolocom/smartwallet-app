import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'

const STYLE = {
  fontSize: '13px',
  fontWeight: '300',
  color: theme.jolocom.gray1
}

const SideNote = ({style, children, ...props}) => {
  return (
    <p style={Object.assign({}, STYLE, style)} {...props}>
      {children}
    </p>
  )
}

SideNote.propTypes = {
  children: React.PropTypes.node,
  style: React.PropTypes.object
}

export default Radium(SideNote)
