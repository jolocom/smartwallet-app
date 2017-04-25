import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'

const STYLES = {
  header: {
    margin: '42px 0 16px 0'
  },
  title: {
    color: theme.jolocom.gray1,
    fontSize: '24px',
    fontWeight: '100',
    margin: 0
  }
}

const Header = ({image, title, style, children, ...props}) => {
  return (
    <header style={Object.assign({}, STYLES.header, style)} {...props}>
      {image}
      {
        title && title.split('\\n').map(function(item, key) {
          return (
            <span key={key}>
              <h1 style={STYLES.title}>{item}</h1>
              <br />
            </span>
          )
        })
      }
      {children}
    </header>
  )
}

Header.propTypes = {
  image: React.PropTypes.any,
  title: React.PropTypes.string,
  children: React.PropTypes.node,
  style: React.PropTypes.object
}

export default Radium(Header)
