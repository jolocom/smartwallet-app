import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import Divider from 'material-ui/Divider'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import Location from 'material-ui/svg-icons/maps/place'

import { theme } from 'styles'
import { IconIdCard, IconPassport } from '../../common'
import { Content, Block } from '../../structure'
import { SubMenuIcon } from './ui'
import { TabContainer, HalfScreenContainer } from '../../wallet/presentation/ui'

const STYLES = {
  listItem: {
    whiteSpace: 'nowrap',
    padding: '0 16px 0 72px'
  },
  inputName: {
    color: theme.palette.textColor,
    fontSize: '1em'
  },
  labelName: {
    color: theme.textStyles.labelInputFields.color
  },
  divider: {
    marginLeft: '16px'
  },
  simpleDialog: {
    contentStyle: {
    },
    actionsContainerStyle: {
      textAlign: 'right'
    }
  },
  avatar: {
    marginTop: '10px'
  },
  container: {
    marginLeft: '10px',
    marginRight: '10px'
  },
  infoHeader: {
    textAlign: 'left',
    color: theme.textStyles.subheadline.color,
    fontSize: theme.textStyles.subheadline.fontSize,
    fontWeight: theme.textStyles.subheadline.fontWeight,
    padding: '0 16px 0 54px',
    display: 'inline-block'
  },
  item: {
    alignItems: 'center',
    paddingLeft: '16px',
    display: 'inline-block',
    verticalAlign: 'top',
    width: '100%',
    boxSizing: 'border-box'
  },
  button: {
    padding: '0 16px 0 44px',
    marginTop: '16px'
  }
}
@Radium
export default class SharedDatePresentation extends React.Component {
  static propTypes = {
    serviceUrl: PropTypes.func.isRequired,
    sharedData: PropTypes.array.isRequired,
    serviceName: PropTypes.string.isRequired,
    deleteService: PropTypes.string.isRequired,
    goToAccessRightScreen: PropTypes.func.isRequired,
    showDeleteServiceWindow: PropTypes.func.isRequired
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

  render() {
    const renderFields = this.props.sharedData.map((field, index) => { // eslint-disable-line max-len
      let icon = this.getIcon(field.attrType)
    })
    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content>
            <AppBar
              iconElementLeft={<NavigationArrowBack
                onClick={this.props.goToAccessRightScreen}
                style={{margin: '12px'}} />}
              title={this.props.serviceName} />
            <Block>
              <SubMenuIcon
                name="Contact"
                icon={<NavigationCancel
                  style={{fill: theme.textStyles.sectionheader.color}} />}
                onClick={() => {
                  this.props.deleteService({
                    title: <div style={{textAlign: 'center'}}>
                    Delete Connection to {this.props.serviceName}
                    </div>,
                    message: <div style={{maxWidth: '360px'}}>
                      Are you sure you want to delete the connection to
                      {this.props.serviceName} ? <br />
                      This way you are deleting your account
                    </div>,
                    rightButtonLabel: 'OK',
                    leftButtonLabel: 'CANCEL',
                    style: {
                      dialogContainer: {maxWidth: '480px'},
                      maxWidth: '480px'
                    }
                  })
                }} />
            </Block>
            <Block>
             {renderFields}
            </Block>
            <Block>
              <div style={{...STYLES.item, marginBottom: '15px',
                display: 'inline-block'}}>
                <div style={theme.textStyles.sectionheader}>
                  Status
                </div>
                <Divider style={{marginTop: '16px'}} />
              </div>
            </Block>
            <Block style={STYLES.infoHeader}>
              You are currently logged in to {this.props.serviceName} website.
              <br />
              You can logout by going directly to the service.
            </Block>
            <Block style={STYLES.button}>
              <a href={this.props.serviceUrl} target="_blank">
                <FlatButton secondary label="GO TO SERVICE" />
              </a>
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
