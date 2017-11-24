import React from 'react'
import Radium from 'radium'

import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import ListItem from 'material-ui/List'

import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'

import {theme} from 'styles'

let STYLES = {
  deleteButton: {
    marginTop: '16px',
    color: '#fda72c'
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
  underlineStyle: {
    borderColor: '#fda72c'
  },
  floatingLabelStyle: {
    color: '#fda72c'
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
export default class EditListItem extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    icon: React.PropTypes.any,
    iconStyle: React.PropTypes.object,
    label: React.PropTypes.string,
    name: React.PropTypes.string,
    value: React.PropTypes.string,
    type: React.PropTypes.string,
    types: React.PropTypes.array,
    errorText: React.PropTypes.string,
    children: React.PropTypes.node,
    focused: React.PropTypes.bool,
    onFocusChange: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onTypeChange: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    showErrors: React.PropTypes.bool,
    valid: React.PropTypes.bool,
    underlineHide: React.PropTypes.bool,
    enableDelete: React.PropTypes.bool
  }

  getStyles() {
    return Object.assign({}, STYLES, {

    })
  }

  render() {
    let {
      focused,
      label,
      name,
      value,
      onChange,
      valid,
      showErrors,
      underlineHide,
      errorText
    } = this.props

    let styles = this.getStyles()

    const iconColor = this.props.focused
      ? '#fda72c' : theme.jolocom.gray1

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
          <TextField
            style={STYLES.textField}
            autoFocus={focused}
            inputStyle={styles.input}
            underlineDisabledStyle={styles.disabledUnderline}
            underlineFocusStyle={STYLES.underlineStyle}
            floatingLabelFocusStyle={STYLES.floatingLabelStyle}
            floatingLabelText={label}
            name={name}
            value={value}
            underlineShow={!underlineHide}
            onChange={onChange}
            errorText={showErrors && !valid && !!value ? errorText : null}
          />
        </div>
      </ListItem>
    )
  }

  get deleteButton() {
    if (this.props.enableDelete) {
      return (
        <IconButton
          style={STYLES.deleteButton}
          onTouchTap={this.handleDelete}
        >
          <NavigationCancel color="#fda72c" />
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
