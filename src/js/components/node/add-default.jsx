import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import {TextField, Paper, SelectField, MenuItem} from 'material-ui'

import nodeActions from 'actions/node'
import nodeStore from 'stores/node'

import ImageSelect from 'components/common/image-select.jsx'

let NodeAddDefault = React.createClass({
  mixins: [
    Reflux.connect(nodeStore, 'node')
  ],
  contextTypes: {
    node: React.PropTypes.object,
    user: React.PropTypes.string
  },
  getInitialState() {
    return {
      type: 'default'
    }
  },
  componentDidUpdate(prevProps, prevState) {
    console.log(prevState.node, this.state.node)
    if (!prevState.node && this.state.node) {
      this.props.onSuccess && this.props.onSuccess(this.state.node)
    }
  },
  validates() {
    let {title} = this.state
    return title && title.trim()
  },
  submit() {
    if (!this.validates()) return false

    let {title, description, image} = this.state
    nodeActions.create(this.context.user, title, description, image)
  },
  render: function() {
    let {image} = this.state
    let preview

    if (image) {
      preview = <img src={URL.createObjectURL(image)} style={styles.preview}/>
    }

    return (
      <div style={styles.container}>
        <div style={styles.graph}>
          {preview}
        </div>
        <Paper style={styles.form} rounded={false}>
          <div style={styles.row}>
            <TextField
              hintText="Title"
              fullWidth={true}
              style={styles.input}
              onChange={({target}) => {this.setState({['title']: target.value})}} />
            <SelectField value={this.state.type} onChange={this._handleTypeChange} style={styles.select}>
              <MenuItem value="default" primaryText="Plain text" />
              <MenuItem value="person" primaryText="Person" />
              <MenuItem value="company" primaryText="Company" />
              <MenuItem value="image" primaryText="Image" />
              <MenuItem value="event" primaryText="Event" />
              <MenuItem value="date" primaryText="Date" />
            </SelectField>
          </div>
          <div style={styles.row}>
            <TextField
              hintText="Description"
              fullWidth={true}
              style={styles.input}
              onChange={({target}) => {this.setState({['description']: target.value})}} />
            <ImageSelect onChange={this._handleSelectImage}/>
          </div>
        </Paper>
      </div>
    )
  },

  _handleTypeChange(event, index, value) {
    this.setState({
      type: value
    })
  },

  _handleSelectImage(image) {
    this.setState({image})
  }
})

let styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  graph: {
    background: 'rgba(0,0,0,0.1)',
    flex: 1
  },
  preview: {
    width: '100%'
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '16px'
  },
  row: {
    display: 'flex'
  },
  input: {
    flex: 1
  },
  select: {
    width: 'auto',
    marginLeft: '16px'
  }
}

export default Radium(NodeAddDefault)
