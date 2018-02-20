import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'
// import Loading from '../../common/loading'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import { List, ListItem } from 'material-ui/List'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import Input from 'material-ui/svg-icons/action/input'
import SocialPerson from 'material-ui/svg-icons/social/person'
import Location from 'material-ui/svg-icons/maps/place'
import { IconIdCard, IconPassport } from '../../common'
import { RequestedItem, DisplayClaims, SelectedItem } from './ui'
import { Content, Block } from '../../structure'
import { TabContainer, HalfScreenContainer } from '../../wallet/presentation/ui'
import {theme} from 'styles'

const STYLES = {
  container: {
    margin: '16px'
  },
  info: theme.textStyles.sectionheader,
  avatar: {
    height: '60px',
    width: '60px',
    left: 0,
    top: '3%',
    backgroundColor: '#f3f3f3',
    backgroundPosition: 'center'
  },
  accessHeadline: theme.textStyles.sectionheader,
  buttons: {
    width: '70%'
  },
  loading: {
    marginTop: '100px'
  },
  header: {
    padding: '12px'
  },
  list: {
    marginBottom: '20px'
  },
  divider: {
    marginTop: '8px'
  },
  buttonContainer: {
    textAlign: 'center'
  },
  menu: {
    top: '15px',
    marginTop: '10px',
    marginLeft: '5px',
    marginRight: '5px'
  }
}

@Radium
export default class AccessRequest extends React.Component {
  static propTypes = {
    accessRequest: PropTypes.object,
    configMsg: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
    setSelectedClaim: PropTypes.func.isRequired,
    requestedFields: PropTypes.array,
    setInfoComplete: PropTypes.func.isRequired,
    denyAccess: PropTypes.func.isRequired,
    confirmAccess: PropTypes.func.isRequired
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
    } else if (field === 'name') {
      return SocialPerson
    }
  }

  selectClaims = (field) => {
    const title = 'Your claims for ' + field
    const message = (<DisplayClaims
      key={field}
      field={field}
      setSelectedClaim={this.props.setSelectedClaim}
      accessRequest={this.props.accessRequest}
      />)

    this.props.configMsg({
      title,
      message,
      primaryActionText: 'CANCEL',
      scrollContent: true
    })
    this.props.showDialog()
  }

  checkInformationComplete() {
    let complete = 0
    this.props.requestedFields.map((field) => {
      if (this.props.accessRequest.entity.response[field] !== undefined) {
        complete++
      }
    })
    if (complete === this.props.requestedFields.length) {
      this.props.setInfoComplete()
    }
  }

  render() {
    if (this.props.accessRequest.entity.infoComplete === false) {
      this.checkInformationComplete()
    }
    const name = 'Jolocom SSO' // mock
    const { infoComplete } = this.props.accessRequest.entity
    const fields = this.props.requestedFields
    const renderFields = fields.map((field) => {
      return (
        <div key={field}>
          <RequestedItem
            key={field}
            selectClaims={this.selectClaims}
            field={field}
            icon={this.getIcon(field)} />
          {this.props.accessRequest.entity.response[field]
            ? <SelectedItem
              field={field}
              accessRequest={this.props.accessRequest} />
            : null
          }
        </div>
      )
    })

    return (
      <TabContainer>
        <AppBar
          iconElementLeft={<Input style={STYLES.menu} />}
          title="Login Request" />
        <HalfScreenContainer>
          <Content style={STYLES.container}>

            <Block style={STYLES.header}>
              <ListItem
                leftAvatar={<Avatar src="img/logo.svg"
                  style={STYLES.avatar} />}
                primaryText={name}
                disabled
                innerDivStyle={STYLES.accessHeadline} />
            </Block>
            <Divider style={STYLES.divider} />
            <Block style={STYLES.list}>
              <List>
                {renderFields}
              </List>
            </Block>

            <Block style={STYLES.buttonContainer}>
              <RaisedButton
                label="Confirm"
                secondary
                disabled={!infoComplete}
                style={STYLES.buttons}
                onClick={() => { this.props.confirmAccess() }} />
            </Block>

            <Block style={STYLES.buttonContainer}>
              <RaisedButton
                label="Deny"
                style={STYLES.buttons}
                onClick={() => { this.props.denyAccess() }} />
            </Block>

          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
