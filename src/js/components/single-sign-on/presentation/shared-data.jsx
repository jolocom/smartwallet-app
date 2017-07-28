import React from 'react'
import Radium from 'radium'

import { Divider, AppBar, FlatButton } from 'material-ui'
import {NavigationArrowBack} from 'material-ui/svg-icons'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import {theme} from 'styles'
import {Content, Block} from '../../structure'
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'

import {SubMenuIcon} from './ui'
import {
  TabContainer,
  HalfScreenContainer,
  StaticListItem
} from '../../wallet/presentation/ui'

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
    marginBottom: '15px',
    display: 'inline-block'
  },
  item: {
    alignItems: 'center',
    paddingLeft: '16px',
    display: 'inline-block',
    verticalAlign: 'top',
    width: '100%',
    boxSizing: 'border-box'
  }
}

const SharedDatePresentation = (props) => (<TabContainer>
  <HalfScreenContainer>
    <Content style={STYLES.container}>
      <AppBar
        iconElementLeft={<NavigationArrowBack
          onClick={props.goToAccessRightScreen}
          style={{margin: '12px'}} />}
        title={props.serviceName} />
      <Block>
        <SubMenuIcon
          name="Contact"
          icon={<NavigationCancel
            style={{fill: theme.textStyles.sectionheader.color}} />}
          onClick={() => {
            props.deleteService({
              title: <div style={{textAlign: 'center'}}>
              Delete Connection to {props.serviceName}
              </div>,
              message: <div style={{maxWidth: '360px'}}>
                Are you sure you want to delete the connection to
                {props.serviceName} ? <br />
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
      {
        props.sharedData.map(
          ({value, label, attrType, verified, type = ''}, index, fields) =>
          (<StaticListItem
            key={value}
            verified={verified}
            textValue={value}
            textLabel={'labelText'}
            icon={index === fields.map(({attrType}) => attrType)
              .indexOf(attrType) ? CommunicationCall : null}
            labelText={'label'}
            secondaryTextValue={type} />))
        }
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
        You are currently logged in to {props.serviceName} website. <br />
        You can logout by going directly to the service.
      </Block>
      <Block>
        <a href={props.serviceUrl} target="_blank">
          <FlatButton label="GO TO SERVICE" />
        </a>
      </Block>
    </Content>
  </HalfScreenContainer>
</TabContainer>)

SharedDatePresentation.propTypes = {
  serviceUrl: React.PropTypes.func.isRequired,
  sharedData: React.PropTypes.array.isRequired,
  serviceName: React.PropTypes.string.isRequired,
  deleteService: React.PropTypes.string.isRequired,
  goToAccessRightScreen: React.PropTypes.func.isRequired,
  showDeleteServiceWindow: React.PropTypes.func.isRequired,
  showSharedData: React.PropTypes.func.isRequired
}

export default Radium(SharedDatePresentation)
