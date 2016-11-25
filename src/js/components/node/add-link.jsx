import React from 'react'
import Radium from 'radium'
import {FontIcon, Paper, SelectField, TextField, MenuItem} from 'material-ui'
import nodeActions from 'actions/node'
import Util from 'lib/util'
import GraphPreview from './graph-preview.jsx'
import SnackbarActions from 'actions/snackbar'

let NodeAddLink = React.createClass({
  getInitialState() {
    return {
      currentSelection: 'start',
      startLabel: this.props.node.name || this.props.node.title,
      startUri: this.props.node.uri,
      endLabel: null,
      endUri: null,
      connectionType: 'knows',
      currentCenter: null
    }
  },

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    node: React.PropTypes.object
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
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()
    return (
      <div style={styles.container}>
        <div style={styles.graph}>
          <GraphPreview
            onSelect={this._handleNodeSelect}
          />
          <LowerPart
            {...this.state}
            updateParentField={this._handleFieldUpdate}
            ref='Lower'
          />
        </div>
      </div>
    )
  },

  _handleFieldUpdate(newField) {
    this.state.currentSelection = newField
  },

  /* The next two functions are a bit of an anti pattern
     Still more readable and quicker than doing it the "Right way" */
  _handleNodeSelect(data) {
    this.refs.Lower && this.refs.Lower._handleNodeClick(data)
  },

  submit() {
    this.refs.Lower && this.refs.Lower.submit()
  }
})

/* This component represents the bottom part of the screen,
   containing the target icons and fields for entering nodes.
*/

let LowerPart = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    node: React.PropTypes.object,
    updateParentField: React.PropTypes.func
  },

  getInitialState() {
    return this.props
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
      columnRight: {
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

  render() {
    let styles = this.getStyles()
    let {startLabel, endLabel} = this.state
    let startIconFilled = startLabel && startLabel.trim().length > 0
    let endIconFilled = endLabel && endLabel.trim().length > 0

    return (
      <div style={styles.containerTable}>
        <Paper style={styles.form} rounded={false}>
          <div style={styles.columnLeft}>
            <div style={styles.leftIcon} onClick={this._handleSelectSwap}>
              <FontIcon className='material-icons'
                style={styles.icon}
                color={styles.icon.color}>
                swap_vert
              </FontIcon>
            </div>
          </div>
          <div style={styles.columnRight}>
            <div style={styles.row}>
              <NodeTarget
                value={startLabel}
                field={'start'}
                active={this.state.currentSelection === 'start'}
                filledIcon={startIconFilled}
                onChange={this.handleChangeStart}
                onSelectTarget={this._handleTargetClick} />

              <SelectField
                value={this.state.connectionType}
                onChange={this._handleTypeChange}
                style={styles.select} >
                <MenuItem value='generic' primaryText='Generic' />
                <MenuItem value='knows' primaryText='Knows' />
              </SelectField>
            </div>
            <div style={styles.row}>
              <NodeTarget
                value={endLabel}
                field={'end'}
                active={this.state.currentSelection === 'end'}
                filledIcon={endIconFilled}
                onChange={this.handleChangeEnd}
                onSelectTarget={this._handleTargetClick} />

            </div>
          </div>
        </Paper>
      </div>
    )
  },

  // @TODO
  validates() {
    let {startUri, endUri, connectionType} = this.state
    return startUri && endUri && connectionType
  },

  submit() {
    // @TODO show error
    if (!this.validates()) {
      SnackbarActions.showMessage('Invalid input.')
      return false
    }
    let {startUri, endUri, connectionType} = this.state

    Promise.all([
      fetch(Util.uriToProxied(startUri), {
        method: 'HEAD',
        credentials: 'include'
      }).then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }
      }),
      fetch(Util.uriToProxied(endUri), {
        method: 'HEAD',
        credentials: 'include'
      }).then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }
      })
    ]).then(() => {
      let flag = false
      if (this.state.currentCenter === startUri) {
        flag = true
      }
      nodeActions.link(startUri, connectionType, endUri, flag)
    }).catch((e) => {
      SnackbarActions.showMessage('The nodes you are trying to link together ' +
                                  'aren\'t accessible.')
    })
  },

  handleChangeStart(value) {
    this.setState({
      startUri: value,
      startLabel: value
    })
  },

  handleChangeEnd(value) {
    this.setState({
      endUri: value,
      endLabel: value
    })
  },

  _handleSelectSwap() {
    this.setState({
      startLabel: this.state.endLabel || '',
      startUri: this.state.endUri || '',
      endLabel: this.state.startLabel || '',
      endUri: this.state.startUri || ''
    })
  },

  _handleTypeChange(event, index, value) {
    this.setState({
      connectionType: value
    })
  },

  _handleNodeClick(data) {
    let map = {
      start: ['startLabel', 'startUri'],
      end: ['endLabel', 'endUri']
    }

    let name
    if (data.name) {
      name = data.name
    } else if (data.title) {
      name = data.title
    } else {
      name = data.uri
    }

    if (this.state.currentSelection) {
      let fieldValue = map[this.state.currentSelection][0]
      let fieldUri = map[this.state.currentSelection][1]
      this.setState({
        [fieldValue]: name,
        [fieldUri]: data.uri,
        currentSelection: null
      })
    }
  },

  _handleTargetClick(clicked) {
    let {currentSelection} = this.state
    if (currentSelection) {
      if (currentSelection === clicked) {
        this.setState({currentSelection: null})
      } else {
        this.setState({currentSelection: clicked})
      }
    } else {
      this.setState({currentSelection: clicked})
    }
  }
})

// Represents individual field / icon combination
let NodeTarget = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    value: React.PropTypes.string,
    field: React.PropTypes.string,
    filledIcon: React.PropTypes.bool,
    active: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onSelectTarget: React.PropTypes.func
  },

  getStyles() {
    let {palette, textField} = this.context.muiTheme

    let color = this.props.active
      ? palette.primary1Color
      : textField.hintText

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
      value: {
        color: color
      }
    }
  },

  render() {
    let filledIcon = this.props.filledIcon
      ? 'gps_fixed'
      : 'gps_not_fixed'

    let styles = this.getStyles()
    return (
      <div style={styles.target} onClick={this._handleTouchTap}>
        <FontIcon className='material-icons'
          style={styles.icon}
          color={styles.icon.color}>
          {filledIcon}
        </FontIcon>

        <div style={styles.inner}>
          <div style={styles.value}>
            <TextField type='value'
              value={this.props.value}
              placeholder='Select node'
              onChange={this._handleFieldChange}
            />
          </div>
        </div>
      </div>
    )
  },

  _handleFieldChange(e) {
    this.props.onChange(e.target.value)
  },

  _handleTouchTap() {
    this.props.onSelectTarget(this.props.field)
  }
})

export default Radium(NodeAddLink)
