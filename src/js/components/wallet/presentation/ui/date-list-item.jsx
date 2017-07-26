import React from 'react'
import Radium from 'radium'

import {IconButton, ListItem} from 'material-ui'

import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'
import DatePicker from 'material-ui/DatePicker'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import {theme} from 'styles'

let STYLES = {
  deleteButton: {
    marginTop: '16px'
  },
  fields: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    '@media (max-width: 320px)': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  input: {
    width: '100%',
    color: theme.textStyles.contentInputFields.color,
    cursor: 'inherit'
  },
  type: {
    maxWidth: '120px',
    '@media (minWidth: 321px)': {
      margin: '0 16px'
    }
  },
  disabledUnderline: {
    borderBottom: 'solid',
    borderWidth: 'medium medium 1px'
  },
  icon: {
    top: '22px'
  },
  textField: {
    maxWidth: 'none',
    flex: 1
  },
  item: {
    padding: '0 0px 0 54px'
  },
  floatingText: {
    color: '#9BA0AA',
    fontWeight: '500'
  }
}

@Radium
export default class DateListItem extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    icon: React.PropTypes.any,
    iconStyle: React.PropTypes.object,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    types: React.PropTypes.array,
    children: React.PropTypes.node,
    focused: React.PropTypes.bool,
    onFocusChange: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    enableDelete: React.PropTypes.bool
  }

  getStyles() {
    return Object.assign({}, STYLES, {

    })
  }

  render() {
    const muiTheme = getMuiTheme({
      datePicker: {
        selectColor: theme.palette.primary1Color,
        color: theme.palette.primary1Color
      },
      flatButton: {
        primaryTextColor: theme.palette.accent1Color
      }
    })

    let {
      focused,
      label,
      value,
      onChange
    } = this.props

    let styles = this.getStyles()

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
          <MuiThemeProvider muiTheme={muiTheme}>
            <DatePicker
              style={STYLES.textField}
              fullWidth
              autoFocus={focused}
              inputStyle={styles.input}
              underlineShow={!value}
              underlineDisabledStyle={styles.disabledUnderline}
              floatingLabelText={label}
              floatingLabelStyle={STYLES.floatingText}
              onChange={onChange}
              errorText=""
              okLabel="OK"
              cancelLabel="Cancel" />
          </MuiThemeProvider>
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
