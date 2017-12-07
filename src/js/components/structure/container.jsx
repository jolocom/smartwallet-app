import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import {theme} from 'styles'

const STYLE = {
  wideLayout: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    height: '100%',
    backgroundColor: theme.jolocom.gray1
  },
  container: {
    padding: '16px',
    backgroundColor: theme.jolocom.gray4,
    boxSizing: 'border-box',
    maxWidth: '1200px',
    width: '100%',
    '@media screen and (min-width: 768px)': {
      padding: '16px 50px'
    }
  }
}

const Container = ({style, children, ...props} = {}) => {
  return (
    <div style={STYLE.wideLayout}>
      <div style={Object.assign({},
        STYLE.wideLayout, STYLE.container, style)} {...props}>
        {children}
      </div>
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
}

export default Radium(Container)
