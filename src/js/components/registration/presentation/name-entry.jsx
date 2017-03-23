import React from 'react'
import Radium from 'radium'
import registrationStyles from '../styles'

import {
  RaisedButton,
  TextField
} from 'material-ui'

const STYLES = {
  root: registrationStyles
}

const NameEntry = (props) => {
  return (
    <div style={STYLES.root.container}>
      <div style={STYLES.root.elementSpacing}>
        <h1 style={STYLES.root.header}>Name entry</h1>
      </div>
      <div style={STYLES.root.elementSpacing}>
        <TextField
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
      <div style={STYLES.root.elementSpacing}>
        <RaisedButton
          label="NEXT STEP"
          secondary
          onClick={props.onSubmit} />
      </div>
    </div>
  )
}

NameEntry.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(NameEntry)
