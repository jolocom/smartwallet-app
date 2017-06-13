import React from 'react'
import Radium from 'radium'

import {
  TextField,
  IconButton,
  FlatButton,
  ListItem
} from 'material-ui'

import {
  NavigationCancel,
  HardwareKeyboardArrowRight as ArrowRight
} from 'material-ui/svg-icons'

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
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    children: React.PropTypes.node,
    focused: React.PropTypes.bool.isRequired,
    onFocusChange: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func,
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
      value
    } = this.props

    let styles = this.getStyles()

    const iconColor = this.props.focused
      ? theme.palette.primary1Color : theme.jolocom.gray1

    const icon = this.props.icon
      ? <this.props.icon color={iconColor} style={styles.icon} /> : <div />

    return (
      <ListItem
        style={styles.item}
        onBlur={this.handleBlur}
        leftIcon={icon}
        rightIconButton={this.deleteButton}
        disabled >
        <div style={styles.fields}>
          <TextField
            style={STYLES.textField}
            onFocus={this.handleFocus}
            autoFocus={focused}
            inputStyle={styles.input}
            underlineDisabledStyle={styles.disabledUnderline}
            floatingLabelText={label}
            underlineShow={!value}
            value={value} />
        </div>
      </ListItem>
    )
  }

  get deleteButton() {
    if (this.props.enableDelete) {
      return (
        <IconButton
          style={STYLES.deleteButton}
          onTouchTap={() => this.props.onDelete()}
        >
          <NavigationCancel color="#fda72c" />
        </IconButton>
      )
    }
    return (<IconButton
      style={STYLES.deleteButton}
      onTouchTap={() => this.props.onFocusChange()}
    >
      <ArrowRight color="#d7d6d6" />
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
