import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

const STYLE = {
  padding: '16px'
}

const Footer = ({style, children, ...props}) => {
  return (
    <footer style={Object.assign({}, STYLE, style)} {...props}>
      {children}
    </footer>
  )
}

Footer.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
}

export default Radium(Footer)
