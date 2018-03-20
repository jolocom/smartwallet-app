import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'
import {theme} from 'styles'
import {ListItem} from 'material-ui/List'
import TextField from 'material-ui/TextField'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import Add from 'material-ui/svg-icons/content/add'

const STYLES = {
  icon: {
    color: theme.jolocom.gray1,
    top: '8px',
    left: '8px'
  },
  inputName: theme.textStyles.contentInputFields,
  mainTextField: {
    padding: '8px',
    marginLeft: '8px',
    flex: 1
  },
  listItem: {
    whiteSpace: 'nowrap',
    padding: '0 16px 0 54px'
  },
  values: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '48px',
    '@media (max-width: 320px)': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  button: {
    position: 'absolute',
    top: '15x',
    right: '15px'
  }
}

@Radium
export default class RequestedItem extends React.Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    selectClaims: PropTypes.func.isRequired
  }

  displayFieldName(field) {
    const fieldValue = field.charAt(0).toUpperCase() + field.slice(1)
    return fieldValue
  }

  render() {
    const leftIcon = <this.props.icon color={'grey'} />
    const selectButton = (<FloatingActionButton
      mini
      iconStyle={{fill: theme.palette.accent1Color}}
      backgroundColor={'#fff'}
      style={STYLES.button}
      onClick={() => this.props.selectClaims(this.props.field)}>
      <Add />
    </FloatingActionButton>)

    return (
      <ListItem
        style={STYLES.listItem}
        leftIcon={<div style={STYLES.icon}>{leftIcon}</div>}
        disabled>
        <div style={STYLES.values}>
          <TextField
            id={this.props.field}
            disabled
            key={this.props.field}
            inputStyle={STYLES.inputName}
            underlineShow={false}
            style={STYLES.mainTextField}
            value={this.displayFieldName(this.props.field)} />
          {selectButton}
        </div>
      </ListItem>
    )
  }
}
