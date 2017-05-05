import React from 'react'
import Radium from 'radium'

import {
  IconButton,
  ListItem,
  MenuItem
} from 'material-ui'

import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'

import FormsyText from 'formsy-material-ui/lib/FormsyText'
import FormsySelect from 'formsy-material-ui/lib/FormsySelect'

import {theme} from 'styles'

let STYLES = {
  deleteButton: {
    marginTop: '16px'
  },
  fields: {},
  input: {
    width: '100%',
    color: theme.palette.textColor,
    cursor: 'inherit'
  },
  type: {
    width: '50%'
  },
  disabledUnderline: {
    borderBottom: 'solid',
    borderWidth: 'medium medium 1px'
  },
  icon: {
    top: '16px'
  },
  item: {
    padding: '0 16px 0 72px'
  }
}

@Radium
export default class EditListItem extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    icon: React.PropTypes.any,
    iconStyle: React.PropTypes.object,
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    type: React.PropTypes.string,
    types: React.PropTypes.array,
    errorText: React.PropTypes.string,
    verified: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node,
    focused: React.PropTypes.bool.isRequired,
    onFocusChange: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onTypeChange: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    enableEdit: React.PropTypes.bool,
    enableDelete: React.PropTypes.bool
  }

  getStyles() {
    return Object.assign({}, STYLES, {

    })
  }

  render() {
    let {
      focused,
      verified,
      label,
      name,
      value,
      enableEdit,
      onChange,
      errorText
    } = this.props

    let styles = this.getStyles()

    if (verified) {
      label = `Verified ${label}`
    }

    const iconColor = this.props.focused
      ? theme.palette.primary1Color : theme.jolocom.gray1

    const icon = this.props.icon
      ? <this.props.icon color={iconColor} style={styles.icon} /> : <div />

    return (
      <ListItem
        style={styles.item}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        leftIcon={icon}
        rightIconButton={this.deleteButton}
        disabled
      >
        <div style={styles.fields}>
          <FormsyText
            autoFocus={focused}
            disabled={!enableEdit}
            inputStyle={styles.input}
            underlineDisabledStyle={styles.disabledUnderline}
            floatingLabelText={label}
            name={name}
            value={value}
            onChange={onChange}
            errorText={errorText}
          />
          {this.renderType()}
        </div>
      </ListItem>
    )
  }

  renderType() {
    if (this.props.types) {
      return (
        <FormsySelect
          style={STYLES.type}
          name={`${this.props.name}_type`}
          value={this.props.type}
          onChange={this.props.onTypeChange}
        >
        {this.props.types.map((type, i) => {
          return (
            <MenuItem key={i} value={type} primaryText={type} />
          )
        })}
        </FormsySelect>
      )
    }
  }

  get deleteButton() {
    if (this.props.enableDelete) {
      return (
        <IconButton
          style={STYLES.deleteButton}
          onTouchTap={this.handleDelete}
        >
          <NavigationCancel />
        </IconButton>
      )
    }
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
