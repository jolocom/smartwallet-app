import React from 'react'
import PropTypes from 'prop-types'
// import Radium from 'radium'

import TextField from 'material-ui/TextField'
import { ListItem } from 'material-ui/List'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import SocialPerson from 'material-ui/svg-icons/social/person'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import VerificationButtons from '../../../wallet/presentation/ui/verification-buttons' // eslint-disable-line max-len

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
  icon: {
    top: '13px',
    fill: '#6d6d6d',
    color: '#6d6d6d'
  },
  verifiedIcon: {
    top: '13px',
    fill: '#B3C82D'
  }
}

export default class AttributeDisplay extends React.Component {
  static propTypes = {
    identity: PropTypes.object,
    id: PropTypes.string,
    toggleEditField: PropTypes.func.isRequired,
    enterField: PropTypes.func.isRequired,
    saveAttribute: PropTypes.func.isRequired,
    requestVerificationCode: PropTypes.func,
    enterVerificationCode: PropTypes.func
  }

  componentDidUpdate() {
    const {identity} = this.props
    if (identity.toggleEdit.bool && identity.toggleEdit.field === this.props.id) { // eslint-disable-line max-len
      this.refs[this.props.id].focus()
    }
  }

  getIcon(id, verified) {
    let iconStyle
    if (verified) {
      iconStyle = STYLES.verifiedIcon
    } else {
      iconStyle =  STYLES.icon
    }

    if (id === 'phone') {
      return <CommunicationCall style={iconStyle} />
    } else if (id === 'email') {
      return <CommunicationEmail style={iconStyle} />
    } else if (id === 'name') {
      return <SocialPerson style={iconStyle} />
    }
  }

  render() {
    const {identity} = this.props
    const toggle = identity.toggleEdit.bool && identity.toggleEdit.field === this.props.id // eslint-disable-line max-len
    const verifiable = identity.userData[this.props.id].verifiable
    const verified = verifiable && identity.userData[this.props.id].verified
    const codeIsSent = identity.userData[this.props.id].codeIsSent
    const attrType = this.props.id
    let editButton
    let verificationButtons

    if (!verified && verifiable) {
      verificationButtons = (
        <VerificationButtons
          attrType={attrType}
          requestVerificationCode={this.props.requestVerificationCode}
          enterVerificationCode={this.props.enterVerificationCode}
          value={this.props.identity.userData[attrType].smsCode}
          codeIsSent={codeIsSent}
          enterField={this.props.enterField}
          identity={this.props.identity}
          verified={verified} />
      )
    }

    if (toggle) {
      editButton = (<FloatingActionButton
        mini
        secondary
        onClick={() => this.props.saveAttribute({
          field: attrType
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
            field: attrType,
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
        leftIcon={this.getIcon(this.props.id, verified)}
        disabled>
        <div>
          <TextField
            ref={attrType}
            id={attrType}
            disabled={!toggle}
            underlineShow={toggle}
            value={this.props.identity.userData[attrType].value}
            inputStyle={STYLES.textStyle}
            onChange={(e) =>
              this.props.enterField({
                attrType: attrType,
                value: e.target.value,
                field: 'value'
              })}
            hintText={'Please enter your ' + attrType} />
          {editButton}
        </div>
        <div>
          <block>
            {verificationButtons}
          </block>
        </div>
      </ListItem>
    )
  }
}
