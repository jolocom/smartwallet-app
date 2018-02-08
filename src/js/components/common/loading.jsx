import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import CircularProgress from 'material-ui/CircularProgress'
import {theme} from 'styles'

const Loading = ({style, ...props}) => {
  return (
    <div style={Object.assign({}, styles.container, style)}>
      <CircularProgress
        thickness={props.thickness}
        size={props.size}
        style={styles.spinner} />
      <div style={styles.msg}> {props.loadingMsg} </div>
    </div>
  )
}

Loading.propTypes = {
  style: PropTypes.object
}

const styles = {
  msg: {
    fontSize: theme.textStyles.sectionheader.fontSize,
    fontWeight: theme.textStyles.sectionheader.fontWeight,
    color: theme.textStyles.sectionheader.color,
    marginTop: '30px'
  },
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  spinner: {
    margin: 0
  }
}

export default Radium(Loading)
