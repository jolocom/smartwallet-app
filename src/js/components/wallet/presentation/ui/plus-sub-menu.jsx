import React from 'react'
import Radium from 'radium'
import Wallet from 'material-ui/svg-icons/action/account-balance-wallet'
// import Euro from 'material-ui/svg-icons/action/euro-symbol'
import {theme} from 'styles'

import {
  List,
  FloatingActionButton,
  Divider
} from 'material-ui'

const STYLES = {
  divider: {
  },
  addBtn: {
    position: 'absolute',
    top: '32px',
    right: '8px'
  },
  iconWallet: {
    fill: theme.palette.accent1Color
  },
  iconAdd: {

  },
  infoHeader: {
    textAlign: 'left',
    color: theme.palette.textColor,
    marginBottom: '15px',
    display: 'inline',
    fontSize: '48pt'
  },
  overviewText: {
    color: '#fff'
  },
  currency: {
    display: 'inline',
    textTransform: 'uppercase',
    color: theme.palette.textColor,
    paddingLeft: '10px'
  },
  currIcon: {
    display: 'inline',
    marginLeft: '-24px'
  },
  ethIcon: {
    width: '24px',
    color: theme.palette.textColor
  },
  currRate: {
    paddingLeft: '72px',
    paddingTop: '16px',
    fontWeight: '300',
    color: theme.jolocom.gray2
  },
  item: {
    alignItems: 'center',
    paddingLeft: '72px',
    display: 'inline-block',
    verticalAlign: 'top',
    width: '100%',
    boxSizing: 'border-box'
  },
  root: {
    position: 'relative',
    width: '100%',
    whiteSpace: 'nowrap'
  }

}
const PlusSubMenu = (props) => (<div style={{...STYLES.root, ...props.style}}>
  <List>
    <div style={STYLES.item}>
      <div style={STYLES.currIcon}>
        <img src="/img/ic_ether.svg" style={STYLES.ethIcon} />
      </div>
      <div style={
        props.overview ? {...STYLES.infoHeader, ...STYLES.overviewText}
        : STYLES.infoHeader}>
      {props.amount.toLocaleString('de-DE', {minimumFractionDigits: 2})}
      </div>
      <div style={
        props.overview ? {...STYLES.currency, ...STYLES.overviewText}
        : STYLES.currency}>
      {props.currency}
      </div>
      <Divider style={STYLES.divider} />
    </div>
    {
      props.overview
      ? null
      : <div style={STYLES.addBtn}>
        <FloatingActionButton
          mini
          onClick={props.goToManagement}
          containerElement="label"
          style={STYLES.addBtn}
          backgroundColor={'#fff'}
          iconStyle={props.choice ? STYLES.iconCreate : STYLES.iconAdd}>
          <Wallet style={STYLES.iconWallet} />
        </FloatingActionButton>
      </div>
    }
    <div style={
      props.overview ? {...STYLES.currRate, ...STYLES.overviewText}
      : STYLES.currRate}>
      <p>= {(props.currencyPrice * props.amount).toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR'
      })}
      </p>
      <p>1 ETH = {props.currencyPrice.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR'
      })}
      </p>
    </div>
  </List>
  {props.children}
</div>)

PlusSubMenu.propTypes = {
  amount: React.PropTypes.number,
  currencyPrice: React.PropTypes.number,
  currency: React.PropTypes.any,
  children: React.PropTypes.node,
  style: React.PropTypes.object,
  goToManagement: React.PropTypes.func.isRequired,
  choice: React.PropTypes.bool
}

export default Radium(PlusSubMenu)
