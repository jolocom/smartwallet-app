import React from 'react'
import Radium from 'radium'

import {
  SelectField,
  IconButton,
  ListItem,
  MenuItem
} from 'material-ui'

import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'

import {theme} from 'styles'

let STYLES = {
  deleteButton: {
    marginTop: '16px'
  },
  fields: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: '32px',
    '@media (max-width: 320px)': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  input: {
    width: '100%',
    color: theme.palette.textColor,
    cursor: 'inherit'
  },
  type: {
    maxWidth: '120px',
    '@media (min-width: 321px)': {
      margin: '0 16px'
    }
  },
  disabledUnderline: {
    borderBottom: 'solid',
    borderWidth: 'medium medium 1px'
  },
  icon: {
    top: '16px'
  },
  textField: {
    maxWidth: 'none',
    flex: 1
  },
  item: {
    padding: '0 16px 0 72px'
  }
}

@Radium
export default class SelectListItem extends React.Component {
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
    showErrors: React.PropTypes.bool,
    valid: React.PropTypes.bool,
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
      valid,
      showErrors,
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
        disabled >
        <div style={styles.fields}>
          <SelectField
            style={STYLES.textField}
            autoFocus={focused}
            disabled={!enableEdit}
            inputStyle={styles.input}
            underlineDisabledStyle={styles.disabledUnderline}
            floatingLabelText={label}
            name={name}
            value={value}
            onChange={onChange}
            errorText={showErrors && !valid && !!value ? errorText : null}
          >
          {this.props.types.map((type, i) => <MenuItem
            key={i}
            value={type}
            primaryText={type} />
          )}
          </ SelectField>
        </ div>
      </ ListItem>
    )
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
