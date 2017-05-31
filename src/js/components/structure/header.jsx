import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'

const STYLES = {
  header: {
    margin: '42px 0 16px 0'
  },
  title: {
    color: theme.jolocom.gray1,
    fontSize: '5.5vmin',
    fontWeight: '300',
    margin: 0
  }
}

const Header = ({image, title, style, children, ...props}) => {
  if (title) {
    title = <h1 style={STYLES.title}>{title}</h1>
  }

  return (
    <header style={Object.assign({}, STYLES.header, style)} {...props}>
      {image}
      {title}
      {children}
    </header>
  )
}

Header.propTypes = {
  image: React.PropTypes.any,
  title: React.PropTypes.string,
  children: React.PropTypes.any,
  style: React.PropTypes.object
}

export default Radium(Header)
