import React from 'react'
import Radium from 'radium'
import CircularProgress from 'material-ui/CircularProgress'

const Loading = ({style, ...props}) => {
  return (
    <div style={Object.assign({}, styles.container, style)}>
      <CircularProgress {...props} />
    </div>
  )
}

Loading.propTypes = {
  style: React.PropTypes.object
}

const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default Radium(Loading)
