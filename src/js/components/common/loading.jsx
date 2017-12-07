import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import CircularProgress from 'material-ui/CircularProgress'

const Loading = ({style, ...props}) => {
  return (
    <div style={Object.assign({}, styles.container, style)}>
      <CircularProgress {...props} style={styles.spinner} />
    </div>
  )
}

Loading.propTypes = {
  style: PropTypes.object
}

const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    margin: 0
  }
}

export default Radium(Loading)
