import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'material-ui/List'
import {theme} from 'styles'
import {
  Content,
  Header
} from '../../structure'

import {
  TabContainer,
  HalfScreenContainer,
  DappInteraction
} from './ui'

const STYLES = {
  textStyle: {
    color: theme.palette.textColor,
    fontSize: '1em'
  },
  label: {
    marginLeft: '72px',
    marginTop: '15px',
    color: theme.palette.textColor
  }
}

export default class DappAndServices extends React.Component {
  static propTypes = {
    interactions: PropTypes.object
  }

  render() {
    // eslint-disable-next-line
    const { selfSignedClaims, thirdPartySignedClaims } = this.props.interactions.claimsOverview
    let selfSignedContent
    let thirdPartySignedContent

    if (selfSignedClaims.length > 0) {
      selfSignedContent = selfSignedClaims.map((claim, i) => {
        return (<DappInteraction
          claim={claim}
          key={'self_' + claim.value} />)
      })
    } else {
      selfSignedContent = <div style={STYLES.label}>No claims created</div>
    }

    if (thirdPartySignedClaims.length > 0) {
      thirdPartySignedContent = thirdPartySignedClaims.map((claim, i) => {
        return (<DappInteraction
          claim={claim}
          key={'thirdParty_' + claim.value} />)
      })
    } else {
      // eslint-disable-next-line
      thirdPartySignedContent = <div style={STYLES.label}>No third party claims available</div>
    }

    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content>
            <Header title={'Your claims'} />
            <List key={'selfSigned'}>
              {selfSignedContent}
            </List>
            <Header title={'Verified claims by third party'} />
            <List key={'thirdPartySigned'}>
              {thirdPartySignedContent}
            </List>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
