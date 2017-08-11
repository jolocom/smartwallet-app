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
    id: React.PropTypes.string,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    type: React.PropTypes.string,
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
    let {
      id,
      focused,
      label,
      value,
      onChange,
      types
    } = this.props

    let styles = this.getStyles()

    return (
      <ListItem
        style={styles.item}
        key={id}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        rightIconButton={this.deleteButton}
        disabled >
        <div style={styles.fields}>
          <SelectField
            style={STYLES.textField}
            autoFocus={focused}
            inputStyle={styles.input}
            underlineShow={!value}
            underlineDisabledStyle={styles.disabledUnderline}
            floatingLabelText={label}
            key={id}
            value={value}
            onChange={onChange}
          >
          {types.map((type, i) => <MenuItem
            key={i}
            value={type}
            primaryText={type} />
          )}
          </SelectField>
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
