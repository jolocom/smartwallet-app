import React from 'react'
import Radium from 'radium'

const UserType = (props) => {
  return <div>
    <h1>User type</h1>
    <div onClick={() => props.onChange('expert')}>
      {props.value === 'expert' && '*'}
      Expert
    </div>
    <div onClick={() => props.onChange('layman')}>
      {props.value === 'layman' && '*'}
      Layman
    </div>
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
UserType.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(UserType)
