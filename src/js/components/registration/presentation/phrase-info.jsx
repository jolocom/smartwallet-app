import React from 'react'
import Radium from 'radium'

const PhraseInfo = (props) => {
  return <div>
    <h1>Sure you want us to store your phrase?</h1>
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
PhraseInfo.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(PhraseInfo)
