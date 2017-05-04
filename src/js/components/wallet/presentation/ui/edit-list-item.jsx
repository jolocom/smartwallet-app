import React from 'react'
import Radium from 'radium'

import {
  MenuItem
} from 'material-ui'

import FormsyText from 'formsy-material-ui/lib/FormsyText'
import FormsySelect from 'formsy-material-ui/lib/FormsySelect'

import {theme} from 'styles'

let STYLES = {
  delete: {
    display: 'inline-block',
    marginTop: '20px',
    marginLeft: '10px',
    height: '48px',
    width: '48px',
    cursor: 'pointer'
  },
  deleteIcon: {
    userSelect: 'none',
    marginTop: '14px',
    marginLeft: '8px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    width: '24px',
    height: '24px',
    backgroundImage: 'url(/img/ic_cancel_brown_24px.svg)'
  },
  disabled: {
    color: theme.palette.textColor
  },
  disabledUnderline: {
    borderBottom: 'solid',
    borderWidth: 'medium medium 1px'
  },
  item: {
    display: 'flex'
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
    category: React.PropTypes.string,
    categories: React.PropTypes.array,
    errorText: React.PropTypes.string,
    verified: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node,
    focused: React.PropTypes.bool.isRequired,
    onFocusChange: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onCategoryChange: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    enableEdit: React.PropTypes.bool,
    enableDelete: React.PropTypes.bool
  }

  getStyles() {
    return Object.assign({}, STYLES, {
      icon: Object.assign({
        color: this.props.focused
          ? theme.palette.primary1Color : theme.jolocom.gray1
      }, this.props.iconStyle)
    })
  }

  render() {
    let {
      focused,
      verified,
      icon,
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

    return (
      <div
        style={styles.item}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        <icon style={styles.icon} />
        <FormsyText
          autoFocus={focused}
          disabled={!enableEdit}
          inputStyle={styles.input}
          underlineDisabledStyle={styles.disabledUnderline}
          floatingLabelText={label}
          name={name}
          defaultValue={value}
          onChange={onChange}
          errorText={errorText}
        />
        {this.renderCategory()}
        {this.renderDelete()}
      </div>
    )
  }

  renderCategory() {
    if (this.props.categories) {
      return (
        <FormsySelect
          name={`${this.props.name}_category`}
          onChange={this.props.onCategoryChange}
        >
        {this.props.categories.map((c, i) => {
          return (
            <MenuItem key={i} value={c.value} primaryText={c.label} />
          )
        })}
        </FormsySelect>
      )
    }
  }

  renderDelete() {
    if (this.props.enableDelete) {
      return (
        <div style={STYLES.delete}>
          <div
            onClick={this.handleDelete}
            style={STYLES.deleteIcon}
          />
        </div>
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
