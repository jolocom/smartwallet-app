import React from 'react'
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
  children: React.PropTypes.node,
  style: React.PropTypes.object
}

export default Radium(Footer)
