import React from 'react'
import PropTypes from 'prop-types'
import { ListItem } from 'material-ui/List'
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

export default class DappInteraction extends React.PureComponent {
  static propTypes = {
    claim: PropTypes.object,
    key: PropTypes.string
  }

  render() {
    const claim = this.props.claim

    return (
      <ListItem
        key={this.props.key}
        style={STYLES.textStyle}
        leftIcon={<ActionDone color={'grey'} style={STYLES.icon} />}
        rightIcon={
          <div style={STYLES.date}>
            {new Date(claim.issueDate).toLocaleDateString('en-US')}
          </div>
        }
        primaryText={claim.field.replace( /\b./g, (a) => { return a.toUpperCase(); } ) + ': ' + claim.value}
        secondaryText={'Expires on 12/31/2018'}
        disabled />
    )
  }
}
