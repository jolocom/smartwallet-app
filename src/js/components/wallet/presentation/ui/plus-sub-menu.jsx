import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import Wallet from 'material-ui/svg-icons/action/account-balance-wallet'
import {theme} from 'styles'

import List from 'material-ui/List'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Divider from 'material-ui/Divider'

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
    display: 'inline'
  },
  ethSvg: {
    width: '24px'
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
const PlusSubMenu = (props) => {
  return (<div style={{...STYLES.root, ...props.style}}>
    <List>
      <div style={STYLES.item}>
        <div style={STYLES.currIcon}>
          <div style={STYLES.ethIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              style={STYLES.ethSvg}>
              <path style={props.ethSvg || {fill: '#fff'}}
                d="M12 13.975l-4.826-2.704L12 2.489l4.823 8.782z" />
              <path style={props.ethSvg || {fill: '#fff'}}
                d="M12 21.51l-4.949-9.005L12 15.332l4.949-2.827z" />
            </svg>
          </div>
        </div>
        <div style={
          props.overview ? {...STYLES.infoHeader, ...STYLES.overviewText}
          : STYLES.infoHeader}>
        {Number(props.amount).toLocaleString('de-DE', {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4
        })}
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
          currency: 'EUR',
          minimumFractionDigits: 4,
          maximumFractionDigits: 4
        })}
        </p>
        <p>1 ETH = {props.currencyPrice.toLocaleString('de-DE', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 4,
          maximumFractionDigits: 4
        })}
        </p>
      </div>
    </List>
  {props.children}
  </div>)
}

PlusSubMenu.propTypes = {
  amount: PropTypes.any,
  currencyPrice: PropTypes.number,
  currency: PropTypes.any,
  children: PropTypes.node,
  style: PropTypes.object,
  goToManagement: PropTypes.func,
  choice: PropTypes.bool,
  overview: PropTypes.any,
  ethSvg: PropTypes.object
}

export default Radium(PlusSubMenu)
