import React from 'react'
import Radium from 'radium'

import {TabContainer, HalfScreenContainer}
  from '../../wallet/presentation/ui'
import LeftNavToggle from 'components/left-nav/toggle'
import Avatar from 'material-ui/Avatar'
import {Divider, FlatButton, RaisedButton,
  ListItem, AppBar, List} from 'material-ui'
import {theme} from 'styles'
import {Content, Block} from '../../structure'
import {IconEther, IconBlockchain} from '../../common'

import PlusMenu from './ui/plus-menu'
import StaticListItem from './ui/static-list-item'

import Done from 'material-ui/svg-icons/action/done'
const STYLES = {
  container: {
    margin: '0 0 0 36px'
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
    lineHeight: '28px'
  },
  listItem: {
    fontSize: '16px',
    color: theme.textStyles.subheadline.color,
    fontWeight: theme.textStyles.subheadline.fontWeight,
    lineHeight: '16px'
  },
  loading: {
    marginTop: '100px'
  },
  infoHeader: {
    textAlign: 'left',
    color: theme.textStyles.sectionheader.color,
    fontSize: theme.textStyles.sectionheader.fontSize,
    fontWeight: theme.textStyles.sectionheader.fontWeight,
    marginBottom: '15px',
    display: 'inline-block'
  },
  item: {
    alignItems: 'center',
    display: 'inline-block',
    verticalAlign: 'top',
    width: '100%',
    boxSizing: 'border-box'
  },
  ethAmount: {
    fontSize: '22px'
  },
  buttons: {
    order: 1,
    width: '80%',
    marginBottom: '8px',
    '@media screen and (minWidth: 520px)': {
      width: '50%'
    }
  },
  fundsNotSufficient: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '0 0 0 -36px'
  },
  fundsNotSufficientInner: {
    color: theme.palette.textColor_grey,
    margin: '0 18px 0 18px',
    fontSize: '14px',
    textAlign: 'center'
  },
  etherIcon: {
    top: '3px',
    left: '0px'
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  methodDescriptionInner: {
    fontSize: '14px',
    color: 'grey'
  }
}

@Radium
export default class EthApprovalRequest extends React.Component {
  static propTypes = {
    ethereumConnect: React.PropTypes.object,
    toggleSecuritySection: React.PropTypes.func.isRequired
  }

  render() {
    const headerMessage = (<div>
      <div>T3N Magazine</div>
      <div>Subscription contract</div></div>
    )
    const {ethereumConnect, toggleSecuritySection} = this.props

    let securityObj = [{
      type: 'Contract Ownerhsip',
      text: 'XX is verified contract owner',
      verified: true
    }, {
      type: 'Security Audit',
      text: 'This contract is secure',
      verified: true
    }, {
      type: 'Method Audit',
      text: 'The functionality of contract is confirmed',
      verified: false
    }]

    const renderSecurityFields = securityObj.map((item) => {
      return (
        <StaticListItem
          icon={Done}
          text={item.text}
          type={item.type}
          verified={item.verified} />
      )
    })

    const renderHeader = (
      <Block>
        <ListItem
          leftAvatar={<Avatar src={'img/img_t3n.png'}
            style={STYLES.avatar} />}
          primaryText={headerMessage}
          disabled
          innerDivStyle={STYLES.accessHeadline} />
      </Block>
    )

    const renderMethodDescription = (<div>
      <List>
        <div style={STYLES.item}>
          <div style={STYLES.infoHeader}>
          What does it actually do?
          </div>
          <Divider />
        </div>
      </List>
      <ListItem
        leftIcon={<IconBlockchain color={theme.palette.textColor} />}
        primaryText={'method describe'}
        innerDivStyle={STYLES.methodDescriptionInner}
        disabled /></div>
    )

    const renderCosts = (<div>
      <Block>
        <ListItem
          leftIcon={<div style={STYLES.etherIcon}>
            <IconEther color={theme.palette.textColor} /></div>}
          primaryText={<p>
            <span style={STYLES.ethAmount}>0.555</span> Amount due</p>}
          secondaryText={<p><span>0.0030</span> Transaction fee</p>}
          disabled />
        <br />
      </Block>
      {ethereumConnect.fundsNotSufficient ? <Block
        style={STYLES.fundsNotSufficient}>
        <ListItem
          primaryText={'OOOPS..you currently dont have enough ether.' +
          ' Please refill your account.'}
          innerDivStyle={STYLES.fundsNotSufficientInner}
          disabled />
        <RaisedButton
          label="GET ETHER"
          secondary
          style={STYLES.buttons}
          onClick={() => {
            window.open('https://www.coinbase.com/?locale=de', '_blank')
          }} />
      </Block> : null}</div>
    )

    const renderSecurityLevel = (<div>
      <PlusMenu
        securityDetails={securityObj}
        toggle={toggleSecuritySection}
        name="Security Level"
        choice
        expanded={ethereumConnect.expanded} />
      {ethereumConnect.expanded ? renderSecurityFields : null}</div>
    )

    const renderButtons = (
      <Block
        style={STYLES.buttonsContainer}>
        <br />
        <RaisedButton
          label="CONFRIM"
          disabled={ethereumConnect.fundsNotSufficient}
          secondary
          style={STYLES.buttons}
          onClick={() => this.props.executeTransaction} />
        <br />
        <RaisedButton
          label="DENY"
          style={STYLES.buttons}
          onClick={() => {}} />
      </Block>
    )

    return (
      <TabContainer>
        <AppBar
          iconElementLeft={<LeftNavToggle />}
          title="Contract Confirmation" />
        <HalfScreenContainer>
          <Content style={STYLES.container}>
            {renderHeader}
            {renderCosts}
            {renderMethodDescription}
          </Content>
          <br />
          {renderSecurityLevel}
          {renderButtons}
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
