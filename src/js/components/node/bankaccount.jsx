import React from 'react'
import Radium from 'radium'

import {
  IconButton,
  RaisedButton,
  FlatButton,
  Dialog,
  Card, CardMedia, CardTitle, CardActions
} from 'material-ui'

import {Spacer} from 'components/layout'

let BankAccountNode = React.createClass({

  contextTypes: {
    history: React.PropTypes.any
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
    this.setState({showPermissions:false})
  },

  getStyles() {
    return {
      container: {
        flex: 1,
        position: 'relative'
      },
      media: {
        color: '#fff',
        height: '176px',
        background: `#fc0`
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
        label="Ok"
        primary={true}
        onTouchTap={this._handleAccept}
      />
    ]

    return (
      <div style={styles.container}>
        <Card zDepth={0}>
          <CardMedia style={styles.media} overlay={
            <CardTitle
              titleColor="#0000000"
              title="Everyday account"
              subtitle="06123456"
              subtitleColor="#000000"
            />
          }
          overlayContentStyle={{background:'transparent', color:'#000000'}}
          />
          <CardActions style={styles.actions}>
            <RaisedButton label="Transfer money" onTouchTap={this._handleOpen} />
            <Spacer/>
            <IconButton iconClassName="material-icons">share</IconButton>
          </CardActions>
        </Card>

        Transactions

        <Dialog
          title="Transfer money"
          actions={actions}
          modal={true}
          open={this.state.showPermissions}
        >

        </Dialog>
      </div>
    )
  }
})

export default Radium(BankAccountNode)
