import React from 'react'
import Radium from 'radium'
import {TextField, Paper, SelectField, MenuItem} from 'material-ui'
import WebIdAgent from 'lib/agents/webid'

import GraphPreview from 'components/node/graph-preview'
import ImageSelect from 'components/common/image-select'
import GraphAgent from 'lib/agents/graph'
import nodeActions from 'actions/node'

let NodeAddDefault = React.createClass({
  propTypes: {
    graphState: React.PropTypes.object,
    node: React.PropTypes.object
  },

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.graph}>
          <GraphPreview
            onSelect={this._handleNodeSelect}
          />
          <LowerPart
            ref="Lower"
            graphState={this.props.graphState}
          />
        </div>
      </div>
    )
  },

  submit() {
    this.refs.Lower && this.refs.Lower.submit()
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

let LowerPart = React.createClass({
  getInitialState() {
    return {
      type: 'default',
      title: null,
      description: null,
      image: null
    }
  },

  propTypes: {
    graphState: React.PropTypes.object,
    node: React.PropTypes.object
  },

  render() {
    return (
      <div>
        <Paper style={styles.form} rounded={false}>
          <div style={styles.row}>
            <TextField
              hintText="Title"
              fullWidth
              style={styles.input}
              onChange={this._handleTitleChange}
            />
            <SelectField value={this.state.type}
              onChange={this._handleTypeChange} style={styles.select}>
              <MenuItem value="default" primaryText="Plain text" />
              <MenuItem value="image" primaryText="Image" />
              <MenuItem value="confidential" primaryText="Confidential" />
            </SelectField>
          </div>
          <div style={styles.row}>
            <TextField
              hintText="Description"
              fullWidth
              style={styles.input}
              onChange={this._handleDescriptionChange}
            />
            <ImageSelect onChange={this._handleSelectImage} />
          </div>
        </Paper>
      </div>
    )
  },

  _handleTitleChange(event) {
    this.setState({title: event.target.value})
  },

  _handleDescriptionChange(event) {
    this.setState({description: event.target.value})
  },

  _handleTypeChange(event, index, value) {
    this.setState({type: value})
  },

  componentDidMount() {
    this.gAgent = new GraphAgent()
  },

  submit() {
    const wia = new WebIdAgent()
    const webId = wia.getWebId()

    if (!(this.state.title && this.state.title.trim())) {
      return
    }

    let centerNode = this.props.graphState.center
    if (centerNode && webId) {
      let isConfidential = this.state.type === 'confidential'
      let {title, description, image} = this.state

      nodeActions.create(
        webId,
        centerNode,
        title,
        description,
        image,
        this.state.type,
        isConfidential
      )
    }
  },

  _handleSelectImage(image) {
    this.setState({image})
  }
})

export default Radium(NodeAddDefault)
