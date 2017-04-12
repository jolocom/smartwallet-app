import React from 'react'
import Radium from 'radium'
import {
  EditAppBar,
  EditHeader,
  Container,
  Content,
  Block,
  EditListItem,
  AddNew
} from './ui'
import {theme} from 'styles'
import ContentMail from 'material-ui/svg-icons/content/mail'
import {
  List
} from 'material-ui'

const STYLES = {
  title: {
    padding: '0 24px',
    color: theme.palette.textColor,
    fontWeight: '100'
  },
  titleDivider: {
    marginTop: '10px'
  },
  icon: {
    marginTop: '40px',
    marginRight: '40px'
  }
}

@Radium
export default class WalletContact extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onChange: React.PropTypes.func,
    focused: React.PropTypes.string,
    onFocusChange: React.PropTypes.func,
    information: React.PropTypes.object,
    getAccountInformation: React.PropTypes.func,
    updateInformation: React.PropTypes.func,
    deleteInformation: React.PropTypes.func,
    setInformation: React.PropTypes.func,
    exitWithoutSaving: React.PropTypes.func,
    saveChanges: React.PropTypes.func,
    loading: React.PropTypes.bool,
    showErrors: React.PropTypes.bool,
    addNewEntry: React.PropTypes.func,
    validate: React.PropTypes.func
  }

  render() {
    let emailFields = []
    // console.log(emailFields)
    if (this.props.loading === false) {
      emailFields.push(this.props.information.originalInformation.emails
      .map((email, i) => {
        if (!email.delete) {
          return (
            <Block key={'originalInformation' + 'emails' + i}>
              <EditListItem
                id={'originalInformation' + 'emails' + i}
                icon={ContentMail}
                iconStyle={STYLES.icon}
                textLabel="Email Address"
                textName="email"
                textValue={email.address}
                verified={email.verified}
                errorText={
                  this.props.showErrors &&
                  !email.valid ? 'Email not valid' : ''}
                focused={
                  this.props.focused === 'originalInformation' + 'emails' + i}
                onFocusChange={this.props.onFocusChange}
                onChange={
                 (e) => this.props.updateInformation('emails', i, e.target.value)} //eslint-disable-line
                onDelete={() => {
                  this.props.deleteInformation('originalInformation', 'emails', i) //eslint-disable-line
                }}
                />
            </Block>
          )
        }
      }
      ))
      emailFields.push(this.props.information.newInformation.emails
      .map((email, i) => {
        if (!email.delete) {
          return (
            <Block key={'newInformation' + 'emails' + i}>
              <EditListItem
                id={'newInformation' + 'emails' + i}
                icon={ContentMail}
                iconStyle={STYLES.icon}
                textLabel="Email Address"
                textName="email"
                textValue={email.address}
                verified={false}
                errorText={
                  this.props.showErrors &&
                  !email.valid &&
                  !email.blank ? 'Email not valid' : ''}
                focused={
                  this.props.focused === 'newInformation' + 'emails' + i}
                onFocusChange={this.props.onFocusChange}
                onChange={
                 (e) => this.props.setInformation(
                   'emails', i, e.target.value)}
                onDelete={() => {
                  this.props.deleteInformation('newInformation', 'emails', i)
                }}
                />
            </Block>
          )
        }
      }
    ))
      if (emailFields[0].length === 0 && emailFields[1].length === 0) {
        emailFields.push(
          <EditListItem
            id={'newInformation' + 'emails' + 0}
            icon={ContentMail}
            iconStyle={STYLES.icon}
            textLabel="Email Address"
            textName="email"
            textValue=""
            verified={false}
            focused={this.props.focused === 'newInformation' + 'emails' + 0}
            onFocusChange={() => {
              this.props.addNewEntry('emails')
              this.props.onFocusChange('newInformation' + 'emails' + 0)
            }}
            onChange={
             (e) => this.props.setInformation(
               'emails', 0, e.target.value)}
            onDelete={() => {
              this.props.deleteInformation('newInformation', 'emails', 0)
            }} />
        )
      } else {
        emailFields.push(
          <Block key="addEmailField">
            <AddNew onClick={() => {
              this._handleAddNewClick()
            }}
              value="Additional Email" />
          </Block>
        )
      }
    }
    // fields = [<div key="key1">blah1</div>, <div key="key2">blah2</div>]

    // console.log(emailFields)
    return (
      <Container>
        <EditAppBar title="Edit Contact"
          loading={this.props.loading}
          onSave={this.props.saveChanges}
          onClose={this.props.exitWithoutSaving} />
        <Content>
          <EditHeader title="Contact" />
          <List>
            {emailFields}
          </List>
        </Content>
      </Container>
    )
  }
  _handleAddNewClick = () => {
    if (this.props.information.newInformation.emails.length === 0 ||
      this.props.information.newInformation.emails[
        this.props.information.newInformation.emails.length - 1].address !==
         '') {
      this.props.addNewEntry('emails')
      this.props.onFocusChange(
        'newInformation' + 'emails' +
         this.props.information.newInformation.emails.length)
    }
  }
}
