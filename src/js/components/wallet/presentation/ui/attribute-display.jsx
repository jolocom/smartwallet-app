import React from 'react'
import PropTypes from 'prop-types'
// import Radium from 'radium'

import TextField from 'material-ui/TextField'
import { ListItem } from 'material-ui/List'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import SocialPerson from 'material-ui/svg-icons/social/person'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {MissingInfoItem, NotVerifiedItem, VerifiedItem} from '../../../single-sign-on/presentation/ui'
import VerifiedShield from '../../../wallet/presentation/ui/verified-shield'

import ActionDone from 'material-ui/svg-icons/action/done'
import ContentCreate from 'material-ui/svg-icons/content/create'
import {theme} from 'styles'

const STYLES = {
  addBtn: {
    position: 'absolute',
    top: '15x',
    right: '15px'
  },
  textStyle: {
    color: theme.palette.textColor,
    fontSize: '1em'
  },
  addBtn1: {
    position: 'absolute',
    top: '23%',
    color: '#942F51',
    right: '70px'
  },
  icon: {
    top: '13px'
  }
}

export default class AttributeDisplay extends React.Component {
  static propTypes = {
    identity: PropTypes.object,
    id: PropTypes.string,
    toggleEditField: PropTypes.func.isRequired,
    enterField: PropTypes.func.isRequired,
    saveAttribute: PropTypes.func.isRequired,
    verifyAttribute: PropTypes.func,
    requestVerificationCode: PropTypes.func,
    onConfirm: PropTypes.func,
    enterVerificationCode: PropTypes.func,
    setFocusedPin: PropTypes.func,
    changePinValue: PropTypes.func,
    pinFocused: PropTypes.string,
  }

  componentDidUpdate() {
    const {identity} = this.props
    if (identity.toggleEdit.bool && identity.toggleEdit.field === this.props.id) { // eslint-disable-line max-len
      this.refs[this.props.id].focus()
    }
  }

  getIcon(id) {
    if (id === 'phone') {
      return <CommunicationCall color={'grey'} style={STYLES.icon} />
    } else if (id === 'email') {
      return <CommunicationEmail color={'grey'} style={STYLES.icon} />
    } else if (id === 'name') {
      return <SocialPerson color={'grey'} style={STYLES.icon} />
    }
  }

  render() {
    const {identity} = this.props
    const toggle = identity.toggleEdit.bool && identity.toggleEdit.field === this.props.id // eslint-disable-line max-len
    const verifiable = this.props.identity.userData[this.props.id].verifiable
    const verified = verifiable && this.props.identity.userData[this.props.id].verified
    let editButton
    let listItem
    let field = this.props.id
    let attributes = identity.userData[this.props.id]

    if (!verified) {
      listItem = (
        <NotVerifiedItem
        key={this.props.id}
        requestVerificationCode={this.props.requestVerificationCode}
        enterVerificationCode={this.props.enterVerificationCode}
        resendVerificationCode={this.props.resendVerificationCode}
        identity={this.props.identity}
        field={field}
        attributes={attributes}
        textLabel={field}
        toggle={toggle}
        changePinValue={this.props.changePinValue}
        setFocusedPin={this.props.setFocusedPin}
        enterField={this.props.enterField} />
      )
    } else {
    }

    if (toggle) {
      editButton = (<FloatingActionButton
        mini
        secondary
        onClick={() => this.props.saveAttribute({
          field: this.props.id
        })}
        style={STYLES.addBtn} >
        <ActionDone />
      </FloatingActionButton>)
    } else {
      editButton = (
        <FloatingActionButton
          mini
          iconStyle={{fill: theme.palette.accent1Color}}
          backgroundColor={'#fff'}
          onClick={() => this.props.toggleEditField({
            field: this.props.id,
            value: identity.toggleEdit.bool
          })}
          style={STYLES.addBtn}>
          <ContentCreate />
        </FloatingActionButton>
      )
    }

    return (
      <ListItem
        key={this.props.id}
        leftIcon={this.getIcon(this.props.id)}
        disabled>
        <div>
          <TextField
            ref={this.props.id}
            id={this.props.id}
            disabled={!toggle}
            underlineShow={toggle}
            value={this.props.identity.userData[this.props.id].value}
            inputStyle={STYLES.textStyle}
            onChange={(e) =>
              this.props.enterField({
                attrType: this.props.id,
                value: e.target.value,
                field: 'value'
            })}
            hintText={'Please enter your ' + this.props.id} />
            {editButton}
          </div>
          <div>
          </div>
            {listItem}
      </ListItem>
    )
  }
}
