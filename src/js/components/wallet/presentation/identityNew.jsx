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
  AttributeDisplay
} from './ui'

export default class IdentityNew extends React.Component {
  static propTypes = {
    identityNew: PropTypes.object,
    enterField: PropTypes.func.isRequired,
    saveAttribute: PropTypes.func.isRequired,
    toggleEditField: PropTypes.func.isRequired
  }

  // TODO: when all ready, make fields render within map func
  render() {
    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content>
            <Block>
              <List>
                <AttributeDisplay
                  id={'name'}
                  enterField={this.props.enterField}
                  saveAttribute={this.props.saveAttribute}
                  identity={this.props.identityNew}
                  toggleEditField={this.props.toggleEditField} />
                <AttributeDisplay
                  id={'phone'}
                  enterField={this.props.enterField}
                  saveAttribute={this.props.saveAttribute}
                  identity={this.props.identityNew}
                  toggleEditField={this.props.toggleEditField} />
                <AttributeDisplay
                  id={'email'}
                  enterField={this.props.enterField}
                  saveAttribute={this.props.saveAttribute}
                  identity={this.props.identityNew}
                  toggleEditField={this.props.toggleEditField} />
              </List>
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
