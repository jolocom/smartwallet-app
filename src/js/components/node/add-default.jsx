import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import {TextField, Paper, SelectField, MenuItem} from 'material-ui'

import nodeActions from 'actions/node'
import graphActions from 'actions/graph-actions'
import nodeStore from 'stores/node'
import previewStore from 'stores/preview-store'

import {PRED} from 'lib/namespaces'
import GraphPreview from './graph-preview.jsx'
import ImageSelect from 'components/common/image-select.jsx'
import graphAgent from 'lib/agents/graph.js'

let NodeAddDefault = React.createClass({
  mixins: [
    Reflux.connect(nodeStore, 'node'),
    Reflux.connect(previewStore, 'graphState')
  ],

  contextTypes: {
    node: React.PropTypes.object,
    user: React.PropTypes.object
  },
  getInitialState() {
    return {
      type: 'default'
    }
  },
  componentDidMount() {
    this.gAgent = new graphAgent()
    this.listenTo(previewStore, this.getUser)
  },

  onTrigger(state){
  },

  getUser(state){
    // We need to know the uri of the currently centered node, this way we
    // deduce the Access Controll. Taking it from the graph preview.
    if(state.center) this.user = state.center.uri
  },

  componentDidUpdate(prevProps, prevState) {
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
    if(this.state.graphState.user && this.state.graphState.center){
      let currentUser = this.state.graphState.user
      let centerNode = this.state.graphState.center
      let isConfidential = (this.state.type == 'confidential')
      if (isConfidential) this.state.type = 'default'

      // @TODO Previously called nodeActions.create; except it cannot have a return value
      this.gAgent.createNode(currentUser, centerNode, title, description, image, this.state.type, isConfidential).then((uri) => {
        graphActions.drawNewNode(uri, PRED.isRelatedTo.uri)
      })
    } else {
      console.log('Did not work, logged in user or center node not detected correctly.')
    }
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
          <GraphPreview/>
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
              <MenuItem value="image" primaryText="Image" />
              <MenuItem value="confidential" primaryText="Confidential" />
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
