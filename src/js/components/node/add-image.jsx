import React from 'react'
import Radium from 'radium'
import accepts from 'attr-accept'
import _ from 'lodash'

import {endpoint} from 'settings'
import NodeActions from 'actions/node'

import {TextField, RaisedButton} from 'material-ui'

let NodeAddImage = React.createClass({

  childContextTypes: {
    node: React.PropTypes.object
  },

  componentDidMount() {
    this.open()
  },

  componentDidUpdate(prevProps, prevState) {
    let {title, description} = this.state
    if (prevState.title !== title && !title.trim()) {
      this.setState({
        titleError: 'Title is required'
      })
    }
    if (prevState.description !== description && !description.trim()) {
      this.setState({
        descriptionError: 'Description is required'
      })
    }
    if (this.state.success) {
      this.props.onSuccess && this.props.onSuccess()
    }
  },

  open() {
    this.fileInputEl.value = null
    this.fileInputEl.click()
  },

  submit() {
    let values = _.pick(this.state, 'file', 'title', 'description')
    NodeActions.add(this.props.node, `${endpoint}/eelco/profile/card#me`, values)
  },

  render: function() {
    let preview
    let {file} = this.state

    if (file) {
      preview = <img src={URL.createObjectURL(file)} style={styles.preview} onClick={() => this.open()}/>
    }

    return (
      <div>
        <input
          ref={el => this.fileInputEl = el}
          type="file"
          name="file"
          style={styles.file}
          multiple={false}
          onChange={this._handleSelectFile} />
        {file ? preview : <RaisedButton label="Select or take picture" primary={true} onClick={() => this.open()} />}
        {this.state.error ? (<div style={styles.error}>{this.state.error}</div>) : null}
        <TextField
          floatingLabelText="Title"
          errorText={this.state.titleError}
          fullWidth={true}
          onBlur={({target}) => { this.setState({['title']: target.value})}} />
        <TextField
          floatingLabelText="Description"
          errorText={this.state.descriptionError}
          fullWidth={true}
          multiLine={true}
          rows={2}
          onBlur={({target}) => { this.setState({['description']: target.value})}} />
      </div>
    )
  },

  _handleSelectFile({target}) {
    let file = target.files[0]

    if (!accepts(file, 'image/*')) {
      this.setState({
        error: 'Invalid file type'
      })
    } else {
      this.setState({
        error: null,
        file: file
      })
    }
  }
})

let styles = {
  file: {
    display: 'none'
  },
  preview: {
    width: '100%'
  },
  error: {

  }
}

export default Radium(NodeAddImage)
