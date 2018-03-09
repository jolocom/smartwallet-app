import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'material-ui/List'
import {theme} from 'styles'
import {
  Content,
  Block
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
    marginLeft: '20px',
    marginTop: '15px'
  }
}

export default class DappAndServices extends React.Component {
  static propTypes = {
    selfClaims: PropTypes.array,
    thirdPartyClaims: PropTypes.array
  }

  render() {
    let selfSignedContent
    let thirdPartySignedContent

    if (this.props.selfClaims) {
      selfSignedContent = this.props.selfClaims.map(
        (claim, i) => {
          return (<DappInteraction
            claim={claim}
            key={'self_' + claim.value}
            />)
        }
      )
    }

    if (this.props.thirdPartyClaims) {
      thirdPartySignedContent = this.props.thirdPartyClaims.map((claim, i) => {
        return (<DappInteraction
          claim={claim}
          key={'thirdParty_' + claim.value}
          />)
      }
      )
    }

    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content>
            <Block>
              <div style={STYLES.label}>Claims you added:</div>
              <List key={'selfSigned'}>
                {selfSignedContent}
              </List>
            </Block>
            <Block>
              <div style={STYLES.label}>
                Claims verified by third party services:
              </div>
              <List key={'thirdPartySigned'}>
                {thirdPartySignedContent}
              </List>
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
