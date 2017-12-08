import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import {HalfScreenContainer, PlusSubMenu} from './'
import {Block} from '../../../structure'

import {theme} from 'styles'

const STYLES = {
  etherContainer: {
    backgroundColor: theme.palette.textColor
  }
}

const EtherBalance = (props) => {
  return (
    <HalfScreenContainer>
      <div style={STYLES.etherContainer}>
        <Block>
          <PlusSubMenu
            overview
            amount={props.amount}
            currency="eth"
            currencyPrice={props.currencyPrice}
          />
        </Block>
      </div>
    </HalfScreenContainer>
  )
}

EtherBalance.propTypes = {
  amount: PropTypes.any,
  currencyPrice: PropTypes.number,
  currency: PropTypes.any
}

export default Radium(EtherBalance)
