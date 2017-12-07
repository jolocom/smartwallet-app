import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import SelectField from 'material-ui/SelectField'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import {ListItem} from 'material-ui/List'

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
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    types: PropTypes.array,
    children: PropTypes.node,
    focused: PropTypes.bool,
    onFocusChange: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    enableDelete: PropTypes.bool
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
