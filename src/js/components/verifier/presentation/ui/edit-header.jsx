import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import Divider from 'material-ui/Divider'

import {theme} from 'styles'

const STYLES = {
  header: {
    margin: '42px 16px 16px 16px'
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
    width: '100%',
    minWidth: '350px'
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
  image: PropTypes.any,
  title: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object
}

export default Radium(EditHeader)
