import React from 'react'
import Radium from 'radium'
import NodeActions from 'actions/node'

import {
  IconButton,
  RaisedButton,
  FlatButton,
  Dialog,
  Card, CardMedia, CardTitle, CardText, CardActions
} from 'material-ui'

import {Spacer} from 'components/layout'

let BankNode = React.createClass({

  contextTypes: {
    history: React.PropTypes.any,
    profile: React.PropTypes.any
  },

  getInitialState() {
    return {
      showPermissions: false
    }
  },

  _handleOpen() {
    this.setState({showPermissions:true})
  },

  _handleCancel() {
    this.setState({showPermissions:false})
  },

  _handleAccept() {
    let values = {
      title: '06123456',
      description: 'BankAccount'
    }
    let uri = encodeURIComponent(this.context.profile.webid)
    NodeActions.add(this.context.profile.webid, this.context.profile.webid, values)
    this.setState({showPermissions:false})

    setTimeout(() => {
      this.context.history.pushState(null, `/graph/${uri}`)
    }, 1000)
  },

  getStyles() {
    let background = 'http://biavic.com.au/wp-content/uploads/2015/08/CBA_logo.jpg'
    return {
      container: {
        flex: 1,
        position: 'relative'
      },
      media: {
        color: '#fff',
        height: '176px',
        background: `url("${background}") no-repeat center / contain`
      },
      actions: {
        display: 'flex'
      },
      content: {
        padding: '16px'
      },
      lead: {
        fontWeight: 'bold',
        marginBottom: '8px'
      },
      list: {
        listStyle: 'none',
        marginBottom: '8px'
      }
    }
  },

  render() {
    let styles = this.getStyles()

    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this._handleCancel}
      />,
      <FlatButton
        label="Accept"
        primary={true}
        onTouchTap={this._handleAccept}
      />
    ]

    return (
      <div style={styles.container}>
        <Card zDepth={0}>
          <CardMedia style={styles.media}/>
          <CardTitle title="Everyday account" subtitle="Smart access"/>
          <CardText>
            The all-in-one bank account that provides flexibility, with unlimited electronic transactions.
          </CardText>
          <CardActions style={styles.actions}>
            <RaisedButton backgroundColor="#fc0" label="Open now" onTouchTap={this._handleOpen} />
            <Spacer/>
            <IconButton iconClassName="material-icons">share</IconButton>
          </CardActions>
        </Card>
        <Dialog
          title="Commonwealth Bank requests access to your information via WebID"
          actions={actions}
          modal={true}
          open={this.state.showPermissions}
        >
          <ul>
            <li>Full Name</li>
            <li>Address</li>
            <li>Date Of Birth</li>
            <li>Email Address</li>
            <li>Mobile Number</li>
            <li>One verified relationship</li>
          </ul>
        </Dialog>
      </div>
    )
  }
})

export default Radium(BankNode)
