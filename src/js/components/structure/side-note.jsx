import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'

const STYLE = {
  fontSize: theme.textStyles.textCopy.fontSize,
  fontWeight: theme.textStyles.textCopy.fontWeight,
  color: theme.textStyles.textCopy.color,
  '@media screen and (min-width: 1200px)': {
    fontSize: '14pt'
  }
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
