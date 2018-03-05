import React from 'react'
import PropTypes from 'prop-types'
import { Content, Block } from '../../../structure'
// import Radium from 'radium'

import { ListItem } from 'material-ui/List'
// import IconButton from 'material-ui/IconButton'
import ActionDone from 'material-ui/svg-icons/action/done'
import {theme} from 'styles'

const STYLES = {
  date: {
    heigh: '40px',
    width: '70px',
    fontSize: '14px'
  },
  textStyle: {
    color: theme.palette.textColor,
    fontSize: '1em'
  },
  icon: {
    top: '13px'
  }
}

export default class DappInteraction extends React.Component {
  static propTypes = {
    claim: PropTypes.object,
  }

  render() {
    const claim = this.props.claim

    return (
        <ListItem
          key={'1'}
          leftIcon={<ActionDone color={'grey'} style={STYLES.icon} />}
          rightIcon={<div style={STYLES.date}>{new Date(claim.issueDate).toLocaleDateString("en-US")}</div>}
          primaryText={claim.value}
          secondaryText={claim.field}
          disabled />
    )
  }
}
