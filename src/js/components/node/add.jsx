import React from 'react'
import Radium from 'radium'
import _ from 'lodash'
import {endpoint} from 'settings'

import {AppBar, IconButton, TextField, Styles} from 'material-ui'
import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

let {Colors} = Styles

import NodeActions from 'actions/node'

let types = {
  sensor: {
    uri: {
      label: 'URL'
    }
  },
  default: {
    title: {
      label: 'Title'
    },
    description: {
      label: 'Description'
    }
  }
}

let NodeAdd = React.createClass({

  contextTypes: {
    history: React.PropTypes.any,
    node: React.PropTypes.string
  },

  componentDidMount() {
    this.refs.dialog.show()
  },

  onSubmit() {
    let values = _.pick(this.state, _.keys(types[this.props.params.type] || types.default))
    NodeActions.add(this.props.params.node, `${endpoint}/eelco/profile/card#me`, values)
    // TODO listen to store update
    this.refs.dialog.hide()
    this.context.history.goBack()
  },

  getStyles() {
    return {
      bar: {
        backgroundColor: Colors.grey500
      },
      content: {
        padding: '20px'
      },
      input: {

      }
    }
  },

  render: function() {
    let styles = this.getStyles()

    let type = this.props.params.type

    let title = `Add ${type}`

    let fields = types[type] || types.default

    return (
      <Dialog ref="dialog" fullscreen={true}>
        <Layout>
          <AppBar
            title={title}
            iconElementLeft={<IconButton iconClassName="material-icons" onTouchTap={this.close}>arrow_back</IconButton>}
            iconElementRight={<IconButton iconClassName="material-icons" onTouchTap={this.onSubmit}>check</IconButton>}
            style={styles.bar}
          />
          <Content style={styles.content}>
            {_.map(fields, (field, name) => {
              return (
                <TextField
                  floatingLabelText={field.label}
                  fullWidth={true}
                  onChange={({target}) => { this.setState({[name]: target.value})}} />
              )
            })}
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(NodeAdd)
