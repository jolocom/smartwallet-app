import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import {FontIcon, Paper, SelectField, MenuItem} from 'material-ui'

import nodeActions from 'actions/node'
import nodeStore from 'stores/node'

import GraphPreview from './graph-preview.jsx'

let NodeAddDefault = React.createClass({
  mixins: [
    Reflux.connect(nodeStore, 'node')
  ],
  contextTypes: {
    node: React.PropTypes.object,
    user: React.PropTypes.string,
    muiTheme: React.PropTypes.object
  },
  getInitialState() {
    return {
      start: null,
      end: this.props.node,
      type: 'knows'
    }
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
    nodeActions.create(this.context.user, title, description, image)
  },
  getStyles() {
    console.log(this.context.muiTheme)
    let {palette, textField} = this.context.muiTheme
    let {start, end} = this.state
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
          <GraphPreview/>
        </div>
        <Paper style={styles.form} rounded={false}>
          <div style={styles.row}>
            <NodeTarget selected={start} label="Start" onSelectTarget={this._handleSelectStartTarget}/>
            <SelectField value={this.state.type} onChange={this._handleTypeChange} style={styles.select}>
              <MenuItem value="knows" primaryText="Knows" />
              <MenuItem value="recommends" primaryText="Recommends" />
            </SelectField>
          </div>
          <div style={styles.row}>
            <NodeTarget selection={end} label="End"/>
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

  _handleSelectStartTarget(active) {
    console.log('start target selection', active)
  }

})

let NodeTarget = React.createClass({
  contextTypes: {
    muiTheme: React.PropTypes.object
  },
  getInitialState() {
    return {
      active: false
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
      <div style={styles.target} onTouchTap={this._handleTouchTap}>
        <FontIcon className="material-icons" style={styles.icon} color={styles.icon.color}>gps_fixed</FontIcon>
        <div style={styles.inner}>
          <div style={styles.label}>{this.props.label}</div>
          <div style={styles.value}>{this.props.selection || 'Select node'}</div>
        </div>
      </div>
    )
  },
  _handleTouchTap() {
    this.setState({
      active: !this.state.active
    })
    this.props.onSelectTarget && this.props.onSelectTarget(this.state.active)
  }
})

export default Radium(NodeAddDefault)
