import React from 'react'
import PropTypes from 'prop-types';
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
    textDecoration: 'none',
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
  info: PropTypes.string,
  link: PropTypes.string,
  to: PropTypes.string,
  style: PropTypes.object
}

export default Radium(InfoLink)
