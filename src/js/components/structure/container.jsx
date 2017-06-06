import React from 'react'
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
    width: '100%'
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
  children: React.PropTypes.node,
  style: React.PropTypes.object
}

export default Radium(Container)
