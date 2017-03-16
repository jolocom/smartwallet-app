import React from 'react'
import Radium from 'radium'

import Checkbox from 'material-ui/Checkbox'

const WritePhrase = (props) => {
  return (
    <div>
      <h1>Your secure phrase</h1>
      <p>
        {
          props.value || 'The flying red fox is jumping enthusiastically over\
          the little brown dog.'
        }
      </p>
      <p>
        IMPORTANT <br />
        Write these words down on an analog and secure place. Store it in at
        least two different places. Without these words you cannot access your
        wallet again. Anyone with these words can get access to your wallet!
        By the way! Taking a screenshot is not secure!
      </p>
      <Checkbox
        label="Yes, I have securely written down my phrase."
      />
      <div onClick={props.onSubmit}>Next!</div>
    </div>
  )
}
WritePhrase.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired
}

export default Radium(WritePhrase)
