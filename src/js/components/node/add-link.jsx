import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import d3 from 'd3'
import {FontIcon, Paper, SelectField, TextField, MenuItem} from 'material-ui'

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
    user: React.PropTypes.object,
    muiTheme: React.PropTypes.object
  },

  onStoreChange(input){
    this.state.currentCenter = input.center.uri
  },

  getInitialState() {
    let centerNode = d3.selectAll('.node').filter(function(d) { return d.rank == 'center'})
    let name = this.props.node
    if(centerNode[0][0].__data__.name){
      name = centerNode[0][0].__data__.name
      if(name==null) name = centerNode[0][0].__data__.title }


    return {
      targetSelection: 'start',
      start: null,
      startUri: null,
      end: name,
      endUri: this.props.node,
      type: 'knows',
      currentCenter: null
    }
  },
  componentDidUpdate(prevProps, prevState) {
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
    nodeActions.link(startUri, type, endUri,flag)
  },

  getStyles() {
    let {palette} = this.context.muiTheme
    let color = palette.accent1Color
    let imgUrl = 'img/arrow.png'
    let styles = {

      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      containerTable: {
        display: 'flex'
      },
      leftIcon: {
        width: '35px',
        cursor: 'pointer'
      },
      columnLeft: {
        width: '35px'
      },
      columnRight : {
        backgroundImage: 'url(' + imgUrl + ')',
        backgroundSize: 'cover',
        width: '100%'
      },
      graph: {
        background: 'rgba(0,0,0,0.1)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      icon: {
        color: color,
        margin: '32px 10px',
        width: '20px'
      },
      form: {
        backgroundColor: '#ffffff',
        padding: '16px',
        display: 'flex',
        width: '100%'
      },
      row: {
        display: 'flex'
      },
      inner: {
        flex: 5
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
        <div style={styles.containerTable}>
            <Paper style={styles.form} rounded={false}>
              <div style={styles.columnLeft}>
                <div style={styles.leftIcon} onClick={this._handleSelectSwap}>
                  <FontIcon className="material-icons" style={styles.icon} color={styles.icon.color}>swap_vert</FontIcon>
                </div>
              </div>
              <div style={styles.columnRight}>
                <div style={styles.row}>
                  <NodeTarget selection={start} field={'start'} full={ start ? true : false } targetSelection={targetSelection} onChangeEnd={this.handleChangeStart} onSelectTarget={this._handleSelectStartTarget}/>
                  <SelectField value={this.state.type} onChange={this._handleTypeChange} style={styles.select}>
                    <MenuItem value="generic" primaryText="Generic" />
                    <MenuItem value="knows" primaryText="Knows" />
                  </SelectField>
                </div>
                <div style={styles.row}>
                  <NodeTarget selection={end} field={'end'} full={ end ? true : false } targetSelection={targetSelection} onChangeEnd={this.handleChangeEnd} onSelectTarget={this._handleSelectEndTarget}/>
                </div>
              </div>
            </Paper>
        </div>
      </div>
    )
  },

  handleChangeEnd: function(event) {

    this.setState({endUri: event.target.value,
                  end : event.target.value
    })

  },
  handleChangeStart: function(event) {

    this.setState({startUri: event.target.value,
                  start : event.target.value
    })

  },
  _handleSelectSwap: function() {    
    this.setState({
      start:this.state.end,
      startUri:this.state.endUri,
      end:this.state.start || '',
      endUri:this.state.startUri || ''
    })
  },
  _handleTypeChange(event, index, value) {
    this.setState({
      type: value
    })
  },

  _handleNodeSelect(data) {
    let name
    if (data.name){
      name = data.name
    }
    else if (data.title) {
      name = data.title
    }
    else name=data.uri

    if (this.state.targetSelection) {
      this.setState({
        [this.state.targetSelection]: name,
        [this.state.targetSelection+'Uri']:data.uri,
        targetSelection: null
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
      active: false,
      full: this.props.full
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
        active : active,
        full: this.props.full
      })
    }
  },
  getStyles() {
    let {palette, textField} = this.context.muiTheme

    let color

    if (this.state.active) {
      color = palette.primary1Color
    } else color = textField.hintText


    return {
      target: {
        flex: 1,
        display: 'flex'
      },
      icon: {
        color: color,
        margin: '8px 8px 0 0'
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
      {this.state.full ?
      <FontIcon className="material-icons" style={styles.icon} color={styles.icon.color}>gps_fixed</FontIcon>
      :
      <FontIcon className="material-icons" style={styles.icon} color={styles.icon.color}>gps_not_fixed</FontIcon>
      }

        <div style={styles.inner}>
          <div style={styles.label}>{this.props.label}</div>
          <div style={styles.value}><TextField type="value" value={this.state.selected} placeholder="Select node" onChange={this.props.onChangeEnd}/></div>
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
