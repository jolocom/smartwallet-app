import React from 'react'
import Radium from 'radium'

const UserType = (props) => {
  return <div>
    <h1>Hi !, are you...</h1>
    <div onClick={() => props.onChange('expert')}>
      {props.value === 'expert' && '*'}
      ...a total tech Geek and want to be in absolute control?
    </div>
    <div onClick={() => props.onChange('layman')}>
      {props.value === 'layman' && '*'}
      ...the laid-back type, who doesn't want any hassle.
    </div>
    <div onClick={props.onSubmit}>Next!</div>
    <div onClick={() => { /*why snackbar*/ }}> WHY?</div>
  </div>
}
UserType.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(UserType)
