import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import { List, RaisedButton, FlatButton } from 'material-ui'
import {Content, Block} from '../../../structure'

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
    padding: '18px 0px 18px 0px'
  },
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
  }
}

export default class EthConnectItem extends React.Component {
  static PropTypes = {

  }

  render() {
    console.log(this.props)
    const popupMessage = {
      title: 'Why should I connect my infromation to Ethereum?',
      body: `You can connect your personal validated information to ethreum. Note that
            during this process an identity smart contract will be created for you where
            ....if you want to know more how this works, please go to XXXX. Please also
            note that this step will cost XXX EUR`
    }

    return (
      <div>
      <Block style={STYLES.accessContainer}>
        <RaisedButton
          label="CONNECT TO ETHEREUM"
          style={STYLES.buttons} />
        <FlatButton
          onClick={() =>
          this.props.ethConnectInfo({title: popupMessage.title,
            message: popupMessage.body})}>
          WHY?
        </FlatButton>
      </Block>
      </div>
    )
  }
}
