import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import {ListItem} from 'material-ui/List'

import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'

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
    id: PropTypes.string.isRequired,
    icon: PropTypes.any,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    children: PropTypes.node,
    focused: PropTypes.bool.isRequired,
    onFocusChange: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    enableDelete: PropTypes.bool
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
