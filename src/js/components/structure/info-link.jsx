import React from 'react'
import Radium from 'radium'

import {Link} from 'react-router'

import {theme} from 'styles'

const STYLES = {
  container: {
    fontSize: theme.textStyles.textCopy.fontSize,
    fontWeight: theme.textStyles.textCopy.fontWeight,
    color: theme.textStyles.textCopy.color,
    marginBottom: '10px'
  },
  link: {
    color: theme.palette.accent1Color,
    fontWeight: 'bold'
  }
}

const InfoLink = ({style, info, link, to, ...props}) => {
  return (
    <p style={Object.assign({}, STYLES.container, style)} {...props}>
      {info}&nbsp;<Link to={to} style={STYLES.link}>{link}</Link>
    </p>
  )
}

InfoLink.propTypes = {
  info: React.PropTypes.string,
  link: React.PropTypes.string,
  to: React.PropTypes.string,
  style: React.PropTypes.object
}

export default Radium(InfoLink)
