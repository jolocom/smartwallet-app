import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'
import {theme} from 'styles'
import { ListItem } from 'material-ui/List'

const STYLES = {
  list: {
    margin: '0px',
    padding: '0px 0px 8px 68px'
  },
  text: {
    color: theme.palette.accent1Color
  }
}

@Radium
export default class SelectedItem extends React.Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    accessRequest: PropTypes.object.isRequired
  }

  render() {
    const { field } = this.props
    const claimId = this.props.accessRequest.entity.response[field]
    const { value } = this.props.accessRequest.entity.claims[field]
    const { userDid } = this.props.accessRequest.entity
    const issuer = this.props.accessRequest.entity.claims[field].claims.map((claim) => { // eslint-disable-line max-len
      if (claim.id === claimId) {
        return claim.issuer
      }
    })

    return (
      <div>
        <ListItem
          key={claimId}
          primaryText={value}
          style={STYLES.list}
          innerDivStyle={STYLES.text}
          disabled
          secondaryText={issuer[0] === userDid
          ? 'Self Signed'
          : 'Jolocom Verification Service'} />
      </div>
    )
  }
}
