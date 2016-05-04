import React from 'react'
import Radium from 'radium'
import _ from 'lodash'

import {endpoint} from 'settings'

import {TextField} from 'material-ui'

import NodeActions from 'actions/node'

let NodeAddDefault = React.createClass({
  submit() {
    let values = _.pick(this.state, 'title', 'description')
    NodeActions.add(this.props.node, `${endpoint}/eelco/profile/card#me`, values)

    this.props.onSuccess && this.props.onSuccess()
  },
  render: function() {
    return (
      <div>
        <TextField
          floatingLabelText="Title"
          fullWidth={true}
          onChange={({target}) => { this.setState({['title']: target.value})}} />
        <TextField
          floatingLabelText="Description"
          fullWidth={true}
          onChange={({target}) => { this.setState({['description']: target.value})}} />
      </div>
    )
  }
})

export default Radium(NodeAddDefault)
