import React from 'react'
import Radium from 'radium'

import Loading from '../../common/loading'

import {Divider, FlatButton, RaisedButton,
  ListItem, AppBar, List, TextField} from 'material-ui'
import Avatar from 'material-ui/Avatar'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import Location from 'material-ui/svg-icons/maps/place'
import {IconIdCard, IconPassport} from '../../common'
import {MissingInfoItem, NotVerifiedItem, VerifiedItem} from './ui'
import {Content, Block} from '../../structure'
import {TabContainer, HalfScreenContainer, StaticListItem}
  from '../../wallet/presentation/ui'
import {theme} from 'styles'

const STYLES = {
  container: {
    margin: '16px'
  },
  info: theme.textStyles.sectionheader,
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '10px',
    marginRight: '8px'
  },
  avatar: {
    height: '60px',
    width: '60px',
    left: 0,
    top: '20%',
    backgroundColor: '#f3f3f3',
    backgroundPosition: 'center'
  },
  accessHeadline: {
    fontSize: theme.textStyles.subheadline.fontSize,
    color: theme.textStyles.subheadline.color,
    fontWeight: theme.textStyles.subheadline.fontWeight,
    lineHeight: '24px'
  },
  accessMsgHeader: theme.textStyles.sectionheader,
  accessMsgBody: theme.textStyles.subheadline,
  accessContainer: {
    padding: '8px 16px 0 54px'
  }
}

@Radium
export default class AccessRequest extends React.Component {
  static propTypes = {
    entity: React.PropTypes.object,
    accessInfo: React.PropTypes.func.isRequired,
    grantAccessToRequester: React.PropTypes.func.isRequired,
    identity: React.PropTypes.object,
    requestedFields: React.PropTypes.array,
    location: React.PropTypes.object
  }

  getIcon(field) {
    if (field === 'phone') {
      return CommunicationCall
    } else if (field === 'email') {
      return CommunicationEmail
    } else if (field === 'passport') {
      return IconPassport
    } else if (field === 'address') {
      return Location
    } else if (field === 'idcard') {
      return IconIdCard
    }
  }

  checkCompleteness() {
    let counter = 0
    this.props.requestedFields.map((field) => {
      let attributes = this.checkFields(field)
      let verified = attributes.verified
      if(verified == true) {
        counter++
      }
    })
    if(counter === this.props.requestedFields.length && counter > 0) {
      this.props.setInfoComplete()
    }

  }

  checkFields(field) {
    const {identity} = this.props
    let verified, textValue
    let attribute = identity[field + 's'] || identity.contact[field + 's']

    if (attribute && field === 'phone' && attribute[0] != undefined) {
      verified = attribute[0].verified
      textValue = attribute[0].number
      return ({verified: verified, textValue: textValue})
    } else if (attribute && field === 'email' && attribute[0] != undefined) {
      verified = attribute[0].verified
      textValue = attribute[0].address
      return ({verified: verified, textValue: textValue})
    } else if (attribute && attribute[0] != undefined) {
      verified = attribute[0].verified
      textValue = attribute[0].number
      return ({verified: verified, textValue: textValue})
    } else {
      return ({verified: false, textValue: false})
    }
  }

  render() {
    console.log(this.props.entity)
    this.checkCompleteness()
    const {name, image, infoComplete} = this.props.entity
    const {identity} = this.props
    let popupMessage = {
      title: 'Why do I have to grant access?',
      body: `You are about to connect to the service of ${name}. In order` +
        'to use this service they need some data of you, which is' +
        'stored on the blockchain. You can always disconnect from' +
        'the service through the jolocom app and this way delete your account.'
    }

    let popupMessageDeny = {
      title: 'Access denied...',
      body: `You denied ${name} the access to your data, therefore you cannot
      use the services of this website or need to sign up a different way.`
    }
    let headerMessage = `${name} wants to have access to your data?`

    const fields = this.props.requestedFields || ['No fields requested. Please try again']
    const renderFields = fields.map((field) => {
      let attributes = this.checkFields(field)
      let verified = attributes.verified
      let textValue = attributes.textValue

      if(!textValue) {
        return (
            <MissingInfoItem
              field={field}
              goToMissingInfo={this.props.goToMissingInfo}
              textValue={'Data is missing'} />
          )
      }
      if(verified) {
        return (
          <NotVerifiedItem
            requestVerificationCode={this.props.requestVerificationCode}
            enterVerificationCode={this.props.enterVerificationCode}
            resendVerificationCode={this.props.resendVerificationCode}
            changePinValue={this.props.changePinValue}
            setFocusedPin={this.props.setFocusedPin}
            field={field}
            textLabel={field}
            textValue={textValue}
            icon={this.getIcon(field)} />
        )
      } else {
        return (
          <VerifiedItem
            key={field}
            verified={true}
            textValue={textValue}
            textLabel={field}
            icon={this.getIcon(field)}
            secondaryTextValue={''} />
        )
      }
    })

    let content
    if (this.props.entity.loading) {
      content = (
        <Content>
          <Loading style={{marginTop: '100px'}} />
        </Content>
      )
    } else {
      content = (
        <Content style={STYLES.container}>
          <Block style={{padding: '12px'}}>
            <ListItem
              leftAvatar={<Avatar src={image}
                style={STYLES.avatar} />}
              primaryText={headerMessage}
              disabled
              innerDivStyle={STYLES.accessHeadline} />
          </Block>
          <Block style={STYLES.infoContainer}>
            <div style={STYLES.info}>Requested Information</div>
            <FlatButton
              onClick={() =>
                this.props.accessInfo(popupMessage.title, popupMessage.body)}
              style={STYLES.flatButton}>
              WHY?
            </FlatButton>
          </Block>
          <Divider style={STYLES.container} />
          <Block style={{marginBottom: '20px'}}>
            <List>
            {renderFields}
            </List>
          </Block>
          <Block style={STYLES.accessContainer}>
            <RaisedButton
              label="GIVE ACCESS"
              secondary
              disabled={infoComplete ? false : true}
              style={{width: '100%'}}
              onClick={() => this.props.grantAccessToRequester({
                user: this.props.identity.username.value,
                query: this.props.location
              })} />
          </Block>
          <Block style={STYLES.accessContainer}>
              <RaisedButton
                label="DENY ACCESS"
                style={{width: '100%'}}
                onClick={() =>this.props.denyAccess(popupMessageDeny.title, popupMessageDeny.body)} />
          </Block>
        </Content>
      )
    }

    return (
      <TabContainer>
        <AppBar
          title="Access Request" />
        <HalfScreenContainer>
          {content}
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
