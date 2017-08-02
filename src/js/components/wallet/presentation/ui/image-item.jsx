import React from 'react'
import Radium from 'radium'

import {IconButton, ListItem, Paper} from 'material-ui'

import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'

import {theme} from 'styles'

let STYLES = {
  deleteButton: {
    marginTop: '16px'
  },
  fields: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '350px',
    maxHeight: '280px',
    alignItems: 'flex-end',
    marginRight: '0',
    '@media (maxWidth: 320px)': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  input: {
    width: '100%',
    color: theme.textStyles.contentInputFields.color,
    fontSize: theme.textStyles.contentInputFields.fontSize,
    fontWeight: theme.textStyles.contentInputFields.fontWeight,
    cursor: 'inherit'
  },
  type: {
    height: '50.2px',
    maxWidth: '120px',
    '@media (minWidth: 321px)': {
      margin: '0 16px'
    },
    top: '8px'
  },
  disabledUnderline: {
    borderBottom: 'solid',
    borderWidth: 'medium medium 1px'
  },
  icon: {
    top: '24px'
  },
  textField: {
    maxWidth: '300px',
    maxHeight: '280px',
    flex: 1,
    width: '100%'
  },
  item: {
    padding: '0 0 0 54px'
  }
}

@Radium
export default class EditListItem extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    icon: React.PropTypes.any,
    iconStyle: React.PropTypes.object,
    label: React.PropTypes.string,
    name: React.PropTypes.string,
    value: React.PropTypes.string,
    verified: React.PropTypes.bool,
    children: React.PropTypes.node,
    focused: React.PropTypes.bool,
    onFocusChange: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onTypeChange: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    showErrors: React.PropTypes.bool,
    valid: React.PropTypes.bool,
    enableEdit: React.PropTypes.bool,
    underlineHide: React.PropTypes.bool,
    enableDelete: React.PropTypes.bool,
    widthTextField: React.PropTypes.object
  }

  getStyles() {
    return ({...STYLES})
  }

  render() {
    let { value } = this.props

    let styles = this.getStyles()

    const iconColor = this.props.focused
      ? theme.palette.primary1Color : theme.jolocom.gray1

    const icon = this.props.icon
      ? <this.props.icon color={iconColor}
        style={this.props.iconStyle || styles.icon} /> : null

    return (<ListItem
      style={styles.item}
      onFocus={this.handleFocus}
      onBlur={this.handleBlur}
      leftIcon={icon}
      rightIconButton={this.deleteButton}
      disabled >
      <div style={styles.fields}>
        <Paper zDepth={1} >
          <img
            style={STYLES.textField}
            src={this.props.value} />
        </Paper>
      </div>
    </ListItem>)
  }

  get deleteButton() {
    const visibility = this.props.value ? 'visible' : 'hidden'
    return (<IconButton
      style={{...STYLES.deleteButton, visibility}}
      onTouchTap={this.handleDelete}
    >
      <NavigationCancel />
    </IconButton>)
  }

  handleFocus = () => {
    this.props.onFocusChange(this.props.id)
  }

  handleBlur = () => {
    this.props.onFocusChange('')
  }

  handleDelete = () => {
    this.props.onDelete()
  }

}
