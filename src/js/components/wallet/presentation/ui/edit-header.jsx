import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import {Divider} from 'material-ui'

const STYLES = {
  header: {
    margin: '42px 0 16px 0',
    width: '100%'
  },
  title: {
    color: theme.palette.textColor,
    fontSize: '24px',
    fontWeight: '300',
    margin: 0
  },
  titleDivider: {
    marginTop: '20px',
    margin: '20px 40px 20px 40px',
    width: '100%'
  }
}

const EditHeader = ({image, title, style, children, ...props}) => {
  if (title) {
    title = <h1 style={STYLES.title}>{title}</h1>
  }

  return (
    <header style={Object.assign({}, STYLES.header, style)} {...props}>
      {image}
      {title}
      {children}
      <Divider style={STYLES.titleDivider} />
    </header>
  )
}

EditHeader.propTypes = {
  image: React.PropTypes.any,
  title: React.PropTypes.string,
  children: React.PropTypes.node,
  style: React.PropTypes.object
}

export default Radium(EditHeader)
