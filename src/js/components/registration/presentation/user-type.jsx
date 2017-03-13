import React from 'react'
import Radium from 'radium'

const UserType = (props) => {
  console.log(props)
  return <div>
    <h1>Hi {props.user === '' ? props.user : 'TODO: Connect to Name'}
    !, are you...</h1>
    <div onClick={() => props.onChange('expert')}>
      {props.value === 'expert' && '*'}
      ...a total tech Geek and want to be in absolute control?
    </div>
    <div onClick={() => props.onChange('layman')}>
      {props.value === 'layman' && '*'}
      ...the laid-back type, who doesn't want any hassle.
    </div>
    <div onClick={() => props.onSubmit}>Next!</div>
    <div onClick={() => props.openConfirmDialog('You must be prepared to keep\
     the passphrase you generated in a safe place where you are not going\
    to loose it and where others can\'t find it.', 'OK',
    () => props.closeConfirmDialog)}> WHY?</div>
  </div>
}
UserType.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  openConfirmDialog: React.PropTypes.func,
  closeConfirmDialog: React.PropTypes.func,
  user: React.PropTypes.string
}

export default Radium(UserType)
