import React from 'react'

import {
  IconButton,
  FloatingActionButton,
  List,
  ListItem
} from 'material-ui'

import DeleteIcon from 'material-ui/svg-icons/navigation/cancel'
import PersonAddIcon from 'material-ui/svg-icons/social/person-add'
import UserAvatar from 'components/common/user-avatar'

export default class Participants extends React.Component {
  static contextTypes = {
    account: React.PropTypes.object
  }

  static propTypes = {
    owner: React.PropTypes.string,
    participants: React.PropTypes.array,
    onAdd: React.PropTypes.func,
    onRemove: React.PropTypes.func
  }

  static defaultProps = {
    participants: []
  }

  render() {
    const {participants, owner} = this.props

    let addParticipants

    if (owner === this.context.account.webId) {
      addParticipants = (
        <FloatingActionButton
          secondary
          mini
          onTouchTap={this._handleAddParticipants}
        >
          <PersonAddIcon />
        </FloatingActionButton>
      )
    }

    return (
      <List>
        <ListItem
          primaryText="Participants"
          disabled
          leftAvatar={addParticipants}
        />
        {participants.map((p) => {
          return (
            <Participant
              key={p.webId}
              onRemove={this._handleRemoveParticipant} {...p}
              showRemove={p.webId !== this.context.account.webId}
            />
          )
        })}
      </List>
    )
  }

  _handleAddParticipants = () => {
    if (this.props.onAdd) {
      this.props.onAdd()
    }
  }

  _handleRemoveParticipant = (webId) => {
    if (this.props.onRemove) {
      this.props.onRemove(webId)
    }
  }
}

class Participant extends React.Component {
  static propTypes = {
    onRemove: React.PropTypes.func,
    webId: React.PropTypes.string,
    name: React.PropTypes.string,
    email: React.PropTypes.string,
    imgUri: React.PropTypes.string
  }

  render() {
    let {webId, name, email, imgUri, onRemove} = this.props
    let avatar = <UserAvatar name={name} imgUrl={imgUri} />
    let removeButton

    if (onRemove) {
      removeButton = (
        <IconButton
          onTouchTap={this._handleTouchTap}
        >
          <DeleteIcon />
        </IconButton>
      )
    }

    return (
      <ListItem
        key={webId}
        disabled
        primaryText={name || email}
        leftAvatar={avatar}
        rightIconButton={removeButton}
      />
    )
  }

  _handleTouchTap = () => {
    if (this.props.onRemove) {
      this.props.onRemove(this.props.webId)
    }
  }
}
