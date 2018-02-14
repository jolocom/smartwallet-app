// import PropTypes from 'prop-types'
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
  // static propTypes = {
  // }

  render() {
    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content>
            <Block>
              <List>
                <DappInteraction />
              </List>
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
