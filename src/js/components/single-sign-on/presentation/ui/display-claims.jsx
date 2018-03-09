import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'
import { List, ListItem } from 'material-ui/List'

const STYLES = {
  list: {
    margin: '0px',
    padding: '0px'
  }
}

@Radium
export default class DisplayClaims extends React.Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    accessRequest: PropTypes.object.isRequired,
    setSelectedClaim: PropTypes.func.isRequired
  }

  handleItemClick(claimId) {
    this.props.setSelectedClaim({
      field: this.props.field,
      claimId: claimId
    })
  }

  render() {
    const { field } = this.props
    const { userDid } = this.props.accessRequest.entity
    let content
    if (this.props.accessRequest.entity.claims[field] === undefined) {
      content = (
        <ListItem
          key={field}
          primaryText={'No claims found'} />
      )
    } else {
      const { claims, value } = this.props.accessRequest.entity.claims[field]
      if (claims) {
        content = claims.map((claim, i) => {
          return (
            <ListItem
              key={i}
              value={claim.id}
              primaryText={value}
              onClick={() => {
                this.handleItemClick(claim.id)
              }}
              secondaryText={claim.issuer === userDid
                ? 'Self Signed'
                : 'Jolocom Verification Service'
              } />
          )
        })
      }
    }

    return (
      <List style={STYLES.list}>
        {content}
      </List>
    )
  }
}
