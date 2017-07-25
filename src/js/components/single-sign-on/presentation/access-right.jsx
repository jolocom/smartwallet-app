import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import ContentCreate from 'material-ui/svg-icons/content/create'

import {PlusMenu} from '../../wallet/presentation/ui'

import {
  Avatar,
  AppBar,
  TextField,
  IconButton,
  ListItem
} from 'material-ui'

import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'

let STYLES = {
  deleteButton: {
    marginRight: '16px'
  },
  fields: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    '@media (maxWidth: 320px)': {
      flexDirection: 'column',
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
    maxWidth: '120px',
    paddingLeft: '24px',
    '@media (minWidth: 321px)': {
      margin: '0 16px'
    }
  },
  disabledUnderline: {
    borderBottom: 'solid',
    borderWidth: 'medium medium 1px'
  },
  icon: {
    top: '24px',
    paddingRight: '24px'
  },
  textField: {
    maxWidth: 'none',
    width: '100%'
  }
}

const SingleSignOnAccessRight = (props) => (<div>
  <AppBar title={<div style={{textAlign: 'Left'}}>DApps & Services</div>} />
  <table style={{textAlign: 'center', width: '95%'}}><tbody>
    <tr><td>
      <ContentCreate color={theme.palette.accent1Color} />
    </td><td>
      <PlusMenu style={{textAlign: 'left'}} name="Connected Services" />
    </td></tr>
    {
      props.services.map(({label, iconUrl, deleted, id}, index) =>
      deleted ? null : (<tr key={`service_id_${id}`}><td></td><td>
        <div
          color={theme.palette.primary1Color}
          style={STYLES.icon} />
        <ListItem
          leftAvatar={<Avatar
            style={{backgroundColor: 'grey', top: '24px'}}
            src={iconUrl} />}
          rightIconButton={<IconButton
            style={STYLES.deleteButton}
            onTouchTap={() => {
              props.showDeleteServiceWindow({
                title: <div style={{textAlign: 'center'}}>
                  {`Delete Connection to ${label}`}
                </div>,
                message: <div style={{maxWidth: '360px'}}>
                {`Are you sure you want to delete the connection to ${label} ?`}
                  <br />This way you are deleting your account</div>,
                rightButtonLabel: 'OK',
                leftButtonLabel: 'CANCEL',
                index,
                style: {
                  dialogContainer: {maxWidth: '480px'},
                  maxWidth: '480px'
                }
              })
            }} >
            <NavigationCancel />
          </IconButton>}
          disabled >
          <TextField
            style={STYLES.textField}
            inputStyle={STYLES.input}
            underlineDisabledStyle={STYLES.disabledUnderline}
            value={label}
            disabled
            underlineShow={false} />
        </ListItem>
      </td></tr>))
    }
  </tbody></table>
</div>)

SingleSignOnAccessRight.propTypes = {
  services: React.PropTypes.array,
  showDeleteServiceWindow: React.PropTypes.array
}
export default Radium(SingleSignOnAccessRight)
