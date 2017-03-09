import React from 'react'
import Radium from 'radium'

const WritePhrase = (props) => {
  return <div>
    <h1>Write down your passphrase</h1>
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
WritePhrase.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(WritePhrase)
