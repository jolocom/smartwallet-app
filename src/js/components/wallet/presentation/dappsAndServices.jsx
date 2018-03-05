import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'material-ui/List'
// import {Loading} from '../../common'
import {
  Content,
  Block
} from '../../structure'

import {
  TabContainer,
  HalfScreenContainer,
  DappInteraction
} from './ui'

export default class DappAndServices extends React.Component {
  static propTypes = {
    selfClaims: PropTypes.array,
    thirdPartyClaims: PropTypes.array
  }

  render() {
    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content>
            <Block>
              Claims you added:
              <List>
                {(this.props.selfClaims).forEach((claim) => {
                  return <DappInteraction
                  claim={claim}
                    />
                })}
              </List>
            </Block>
            <Block>
              Claims verified by third party services:
              <List>
                {(this.props.thirdPartyClaims).forEach((claim) => {
                  <DappInteraction
                  claim={claim}
                    />
                })}
              </List>
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
