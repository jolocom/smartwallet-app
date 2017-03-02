import React from 'react'
import Radium from 'radium'

import { connect } from 'redux/utils'

import {
  IconButton,
  FlatButton,
  AppBar
} from 'material-ui'

import values from 'lodash/values'

import UserAvatar from 'components/common/user-avatar'
import Dialog from 'components/common/dialog'
import {Layout, Content} from 'components/layout'

import ContactsList from 'components/contacts/list'

@connect({
  'actions': ['common/dialog:hideDialog']
})
@Radium
export default class AddParticipants extends React.Component {
  static propTypes = {
    participants: React.PropTypes.array,
    onSubmit: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      selected: {}
    }
  }

  getStyles() {
    return {
      selectedList: {
        color: '#e1e2e6',
        padding: '16px',
        display: this.selected.length > 0 ? 'block' : 'none'
      }
    }
  }

  get selected() {
    return values(this.state.selected)
  }

  renderSelected() {
    return this.selected.map((p) => {
      return (
        <UserAvatar
          key={p.webId}
          name={p.name}
          imgUri={p.imgUri}
        /> // @TODO use Chips here?
      )
    })
  }

  render() {
    let styles = this.getStyles()

    return (
      <Dialog id="addParticipants" fullscreen>
        <Layout>
          <AppBar
            title="Add Participants"
            iconElementLeft={
              <IconButton
                onTouchTap={this._handleCancel}
                iconClassName="material-icons"
              >
                arrow_back
              </IconButton>
            }
            iconElementRight={
              <FlatButton
                label="Add"
                disabled={!this.selected.length}
                onTouchTap={this._handleSubmit}
              />
            }
          />
          <Content>
            <div style={styles.selectedList}>
              {this.renderSelected()}
            </div>
            <ContactsList
              selectable
              filter={this._handleFilter}
              onItemCheck={this._handleCheck}
            />
          </Content>
        </Layout>
      </Dialog>
    )
  }

  _handleFilter = (contact) => {
    return this.props.participants.indexOf(contact.webId) === -1
  }

  _handleSubmit = () => {
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.selected)
    }
  }

  _handleCancel = () => {
    this.props.hideDialog({id: 'addParticipants'})
  }

  _handleCheck = (p) => {
    let {selected} = this.state

    if (selected[p.webId]) {
      delete selected[p.webId]
    } else {
      selected[p.webId] = p
    }

    this.setState({
      selected
    })
  }
}
