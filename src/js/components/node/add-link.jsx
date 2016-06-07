import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import d3 from 'd3'

import {FontIcon, Paper, SelectField, MenuItem} from 'material-ui'

import nodeActions from 'actions/node'
import nodeStore from 'stores/node'
import previewStore from 'stores/preview-store'

import GraphPreview from './graph-preview.jsx'

let NodeAddLink = React.createClass({
  mixins: [
    Reflux.connect(nodeStore, 'node'),
    Reflux.listenTo(previewStore, 'onStoreChange')
  ],
  contextTypes: {
    node: React.PropTypes.object,
    user: React.PropTypes.string,
    muiTheme: React.PropTypes.object
  },

  onStoreChange(input){
    this.state.currentCenter = input.center.uri
  },

  getInitialState() {
    let centerNode = d3.selectAll('.node').filter(function(d) { return d.rank == 'center'})
    let name = centerNode[0][0].__data__.name
    if(name==null) name = centerNode[0][0].__data__.title
    if(name==null) name = this.props.node

    return {
      targetSelection: 'end',
      start: null,
      startUri: null,
      end: name,
      endUri: this.props.node,
      type: 'knows',
      currentCenter: null
    }
  },
  componentDidUpdate(prevProps, prevState) {
    console.log(this.state)
    if (!prevState.node && this.state.node) {
      this.props.onSuccess && this.props.onSuccess(this.state.node)
    }
  },
  // @TODO this validation is bullshit ofcourse :)
  validates() {
    let {startUri, endUri, type} = this.state
    return startUri && endUri && type
  },
  submit() {
    //@TODO show error
    if (!this.validates()) return false
    let {startUri, endUri, type} = this.state
    // We just pass the start node [object], end node [subject], and the type
    // The user is the WEBID
    let flag = false

    if(this.state.currentCenter == startUri){
      flag = true
    }
    nodeActions.link(this.context.user, endUri, startUri, type, flag)
  },
  getStyles() {
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
      form: {
        backgroundColor: '#ffffff',
        padding: '16px'
      },
      row: {
        display: 'flex'
      },
      select: {
        width: 'auto',
        marginLeft: '16px'
      }
    }
    return styles
  },
  render: function() {
    let styles = this.getStyles()
    let {start, end , targetSelection} = this.state
    return (
      <div style={styles.container}>
        <div style={styles.graph}>
          <GraphPreview onSelect={this._handleNodeSelect}/>
        </div>
        <Paper style={styles.form} rounded={false}>
          <div style={styles.row}>
            <NodeTarget selection={start} field={'start'} targetSelection={targetSelection} onChangeEnd={this.handleChangeStart} onSelectTarget={this._handleSelectStartTarget}/>
            <SelectField value={this.state.type} onChange={this._handleTypeChange} style={styles.select}>
              <MenuItem value="generic" primaryText="Generic" />
              <MenuItem value="knows" primaryText="Knows" />
            </SelectField>
          </div>
          <div style={styles.row}>
            <NodeTarget selection={end} field={'end'} targetSelection={targetSelection} onChangeEnd={this.handleChangeEnd} onSelectTarget={this._handleSelectEndTarget}/>
          </div>
        </Paper>
      </div>
    )
  },

  handleChangeEnd: function(event) {

    this.setState({endUri: event.target.value.substr(0, 140),
                  end : event.target.value.substr(0, 140)
    })

  },
  handleChangeStart: function(event) {

    this.setState({startUri: event.target.value.substr(0, 140),
                  start : event.target.value.substr(0, 140)
    })

  },
  _handleTypeChange(event, index, value) {
    this.setState({
      type: value
    })
  },

  _handleNodeSelect(node) {
    let name
    if (node.name){
      name = node.name
    }
    else if (node.title) {
      name = node.title
    }
    else name=node.uri

    if (this.state.targetSelection) {
      this.setState({
        [this.state.targetSelection]: name,
        [this.state.targetSelection+'Uri']:node.uri,
        targetSelect: null
      })
    }
  },

  _handleSelectEndTarget(active) {
    this.setState({targetSelection: active && 'end' || null})
  },

  _handleSelectStartTarget(active) {
    this.setState({
      targetSelection: active && 'start' || null })
  }

})

let NodeTarget = React.createClass({
  contextTypes: {
    muiTheme: React.PropTypes.object
  },
  getInitialState() {
    return {
      selected: this.props.selection,
      active: false
    }
  },
  componentDidUpdate(prevProps) {
    if (prevProps!=this.props ) {
      let active = false
      if(this.props.field == this.props.targetSelection){
        active = true
      }
      this.setState({
        selected : this.props.selection,
        active : active
      })
    }
  },
  getStyles() {
    let {palette, textField} = this.context.muiTheme

    let color

    if (this.state.active) {
      color = palette.accent1Color
    } else if (this.props.selection) {
      color = palette.primary1Color
    } else {
      color = textField.hintText
    }

    return {
      target: {
        flex: 1,
        display: 'flex'
      },
      icon: {
        color: color,
        margin: '4px 8px 0 0'
      },
      inner: {
        flex: 1
      },
      label: {
        color: textField.hintText,
        fontSize: '12px'
      },
      value: {
        color: color
      }
    }
  },

  render() {
    let styles = this.getStyles()
    return (
      <div style={styles.target} onClick={this._handleTouchTap}>
        <FontIcon className="material-icons" style={styles.icon} color={styles.icon.color}>gps_fixed</FontIcon>
        <div style={styles.inner}>
          <div style={styles.label}>{this.props.label}</div>
          <div style={styles.value}><input type="value" value={this.state.selected || 'Select node'} onChange={this.props.onChangeEnd}/></div>
        </div>
      </div>
    )
  },
  _handleTouchTap() {
    let active = !this.state.active
    this.props.onSelectTarget && this.props.onSelectTarget(active)
  }
})

export default Radium(NodeAddLink)
