import React from 'react'
import Radium from 'radium'

import Loading from '../../common/loading'

import {Divider, FlatButton, RaisedButton,
  ListItem, AppBar, List} from 'material-ui'
import Avatar from 'material-ui/Avatar'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import Location from 'material-ui/svg-icons/maps/place'

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
    padding: '0 16px 0 54px'
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
      return ({avatar: 'img/ic_passport.svg'})
    } else if (field === 'address') {
      return Location
    } else if (field === 'idcard') {
      return ({avatar: 'img/ic_idcard.svg'})
    }
  }

  render() {
    const {name, image} = this.props.entity
    const {identity} = this.props
    let popupMessage = {
      title: 'Why do I have to grant access?',
      body: `You are about to connect to the service of ${name}. In order` +
        'to use this service they need some data of you, which is' +
        'stored on the blockchain. You can always disconnect from' +
        'the service through the jolocom app and this way delete your account.'
    }
    let headerMessage = `${name} wants to have access to your data?`
    // const accessMessage = (
    //   <div>
    //     <div style={STYLES.accessMsgHeader}>No worries</div><br />
    //     <div style={STYLES.accessMsgBody}>Even if you grant access
    //     to this data now, you can revoke it any time and the service
    //     will forget everything they know about you.</div><br />
    //   </div>
    // )
    const fields = this.props.requestedFields || ['No fields requested']
    const renderFields = fields.map((field) => {
      let verified, textValue
      if (identity.contact[field + 's'] && field === 'phone') {
        verified = identity.contact[field + 's'][0].verified
        textValue = identity.contact[field + 's'][0].number
      } else if (identity.contact[field + 's'] && field === 'email') {
        verified = identity.contact[field + 's'][0].verified
        textValue = identity.contact[field + 's'][0].address
      } else if (identity[field] && field === 'passport') {
        verified = identity[field + 's'][0].verified
        textValue = identity[field + 's'][0].number
      } else {
        // the error case
        return (
          <StaticListItem
            key={field}
            textValue={field + ' requested but not found in your profile'}
            textLabel={'Oooopps'}
            icon={this.getIcon(field)} />
        )
      }
      return (
        <StaticListItem
          key={field}
          verified={verified}
          textValue={textValue}
          textLabel={field}
          icon={this.getIcon(field)}
          secondaryTextValue={''} />
      )
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
              style={{width: '100%'}}
              onClick={() => this.props.grantAccessToRequester({
                user: this.props.identity.username.value,
                query: this.props.location
              })} />
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
