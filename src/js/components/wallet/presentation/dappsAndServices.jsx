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
        (claim) => {
          return (<DappInteraction
            claim={claim}
            />)
        }
      )
    }

    if (this.props.thirdPartyClaims) {
      thirdPartySignedContent = this.props.thirdPartyClaims.map((claim) => {
        return (<DappInteraction
          claim={claim}
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
              <List>
                {selfSignedContent}
              </List>
            </Block>
            <Block>
              <div style={STYLES.label}>
                Claims verified by third party services:
              </div>
              <List>
                { thirdPartySignedContent }
              </List>
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
