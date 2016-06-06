import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import d3 from 'd3'

import {FontIcon, Paper, SelectField, MenuItem} from 'material-ui'

import nodeActions from 'actions/node'
import nodeStore from 'stores/node'

import GraphPreview from './graph-preview.jsx'

let NodeAddLink = React.createClass({
  mixins: [
    Reflux.connect(nodeStore, 'node')
  ],
  contextTypes: {
    node: React.PropTypes.object,
    user: React.PropTypes.string,
    muiTheme: React.PropTypes.object
  },
  getInitialState() {
    let centerNode = d3.selectAll('.node').filter(function(d) { return d.rank == 'center'})
    let name = centerNode[0][0].__data__.name

    if(name==null){
      name = centerNode[0][0].__data__.title
    }

    return {
      targetSelection: null,
      start: null,
      startName: null,
      end: this.props.node,
      endName: name,
      type: 'knows'
    }
  },
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.node && this.state.node) {
      this.props.onSuccess && this.props.onSuccess(this.state.node)
    }
  },
  // @TODO this validation is bullshit ofcourse :)
  validates() {
    let {start, end, type} = this.state
    return start && end && type
  },
  submit() {
    //@TODO show error
    if (!this.validates()) return false
    let {start, end, type} = this.state
  
    // We just pass the start node [object], end node [subject], and the type
    // The user is the WEBID
    console.log(start,end)
    nodeActions.link(start, end, type)
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
    let {start, end} = this.state

    return (
      <div style={styles.container}>
        <div style={styles.graph}>
          <GraphPreview onSelect={this._handleNodeSelect}/>
        </div>
        <Paper style={styles.form} rounded={false}>
          <div style={styles.row}>
            <NodeTarget selection={start} onSelectTarget={this._handleSelectStartTarget}/>
            <SelectField value={this.state.type} onChange={this._handleTypeChange} style={styles.select}>
              <MenuItem value="generic" primaryText="Generic" />
              <MenuItem value="knows" primaryText="Knows" />
            </SelectField>
          </div>
          <div style={styles.row}>
            <NodeTarget selection={end} onSelectTarget={this._handleSelectEndTarget}/>
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
        targetSelect: null
      })
    }
  },

  _handleSelectEndTarget(active) {
    this.setState({targetSelection: active && 'end' || null})
  },

  _handleSelectStartTarget(active) {
    console.log('stateBefore=',this.state.targetSelection)
    this.setState({
      targetSelection: active && 'start' || null })
    console.log('stateAfter=',this.state.targetSelection)
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
    if (prevProps.selection!=this.props.selection ) {
      this.setState({
        selected : this.props.selection
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
  handleChange: function(event) {

    this.setState({selected: event.target.value.substr(0, 140)})

  },
  render() {
    let styles = this.getStyles()
    return (
      <div style={styles.target} onClick={this._handleTouchTap}>
        <FontIcon className="material-icons" style={styles.icon} color={styles.icon.color}>gps_fixed</FontIcon>
        <div style={styles.inner}>
          <div style={styles.label}>{this.props.label}</div>
          <div style={styles.value}><input type="value" value={this.state.selected || 'Select node'} onChange={this.handleChange}/></div>
        </div>
      </div>
    )
  },
  _handleTouchTap() {
    let active = !this.state.active
    this.setState({
      active: active
    })
    this.props.onSelectTarget && this.props.onSelectTarget(active)
  }
})

export default Radium(NodeAddLink)
