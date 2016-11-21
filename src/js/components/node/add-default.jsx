import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import {TextField, Paper, SelectField, MenuItem} from 'material-ui'
import graphActions from 'actions/graph-actions'
import previewStore from 'stores/preview-store'

import {PRED} from 'lib/namespaces'
import GraphPreview from './graph-preview.jsx'
import ImageSelect from 'components/common/image-select.jsx'
import GraphAgent from 'lib/agents/graph.js'

let NodeAddDefault = React.createClass({
  mixins: [
    Reflux.connect(previewStore, 'graph')
  ],

  getInitialState() {
    return {
      type: 'default'
    }
  },

  componentDidMount() {
    this.gAgent = new GraphAgent()
  },

  submit() {
    if (!(this.state.title && this.state.title.trim())) {
      return false
    }

    let webId = localStorage.getItem('jolocom.webId')
    let centerNode = this.state.graph.center

    if (centerNode && webId) {
      let isConfidential = (this.state.type === 'confidential')
      if (isConfidential) {
        this.state.type = 'default'
      }

      let {title, description, image} = this.state
      this.gAgent.createNode(webId, centerNode, title, description,
                             image, this.state.type, isConfidential)
      .then((uri) => {
        graphActions.drawNewNode(uri, PRED.isRelatedTo.uri)
      })
    }
  },

  render: function() {
    return (
      <div style={styles.container}>
        <div style={styles.graph}>
          <GraphPreview />
        </div>
        <Paper style={styles.form} rounded={false}>
          <div style={styles.row}>
            <TextField
              hintText='Title'
              fullWidth={true}
              style={styles.input}
              onChange={({target}) => {
                this.setState({title: target.value})
              }} />
            <SelectField value={this.state.type}
              onChange={this._handleTypeChange} style={styles.select}>

              <MenuItem value='default' primaryText='Plain text' />
              <MenuItem value='image' primaryText='Image' />
              <MenuItem value='confidential' primaryText='Confidential' />
            </SelectField>
          </div>
          <div style={styles.row}>
            <TextField
              hintText='Description'
              fullWidth={true}
              style={styles.input}
              onChange={({target}) => {
                this.setState({description: target.value})
              }} />
            <ImageSelect onChange={this._handleSelectImage} />
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
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
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
    width: '170px',
    marginLeft: '16px'
  }
}

export default Radium(NodeAddDefault)
