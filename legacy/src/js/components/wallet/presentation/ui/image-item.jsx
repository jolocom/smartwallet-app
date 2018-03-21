import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'
import IconButton from 'material-ui/IconButton'
import {ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'

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
      width: '180px',
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
    position: 'relative',
    top: '2px'
  },
  textField: {
    borderRadius: '12px',
    '@media (minWidth: 321px)': {
      width: '24px'
    },
    maxWidth: '300px',
    maxHeight: '280px',
    width: '100%',
    flex: 1
  },
  item: {
    padding: '0 0 0 54px'
  }
}

@Radium
export default class EditListItem extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    icon: PropTypes.any,
    iconStyle: PropTypes.object,
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    verified: PropTypes.bool,
    children: PropTypes.node,
    focused: PropTypes.bool,
    onFocusChange: PropTypes.func,
    onChange: PropTypes.func,
    onTypeChange: PropTypes.func,
    onDelete: PropTypes.func,
    showErrors: PropTypes.bool,
    valid: PropTypes.bool,
    enableEdit: PropTypes.bool,
    underlineHide: PropTypes.bool,
    enableDelete: PropTypes.bool,
    widthTextField: PropTypes.object
  }

  getStyles() {
    return ({...STYLES})
  }

  render() {
    if (this.props.value === '') {
      return null
    }
    let styles = this.getStyles()
    const iconColor = this.props.focused
      ? theme.palette.primary1Color : theme.jolocom.gray1

    const icon = this.props.icon
      ? <div style={{
        backgroundColor: iconColor,
        borderRadius: '2px',
        height: '28px'
      }}>
        <this.props.icon color="white" style={styles.icon} />
      </div> : null

    return (<ListItem
      style={styles.item}
      onFocus={this.handleFocus}
      onBlur={this.handleBlur}
      leftIcon={icon}
      rightIconButton={this.deleteButton}
      disabled >
      <br />
      <div style={styles.fields}>
        <Paper zDepth={1} style={{borderRadius: '12px'}}>
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

  handleDelete = () => {
    this.props.onDelete()
  }

}
