import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import {AppBar, IconButton, FlatButton} from 'material-ui'

import Dialog from 'components/common/dialog.jsx'
import {Layout} from 'components/layout'

let AddContact = React.createClass({

  propTypes: {
    params: React.PropTypes.object,
    center: React.PropTypes.object,
    neighbours: React.PropTypes.array
  },

  contextTypes: {
    router: React.PropTypes.any,
    muiTheme: React.PropTypes.object
  },

  componentDidMount() {
    this.refs.dialog && this.refs.dialog.show()
  },

  getStyles() {
    const {muiTheme: {actionAppBar}} = this.context
    return {
      bar: {
        backgroundColor: actionAppBar.color,
        color: actionAppBar.textColor
      },
      title: {
        color: actionAppBar.textColor
      },
      icon: {
        color: actionAppBar.textColor
      }
    }
  },

  render() {
    let styles = this.getStyles()

    return (
      <div>
        <Dialog ref="dialog" fullscreen>
          <Layout>
            <AppBar
              title="Add Contacts"
              titleStyle={styles.title}
              iconElementLeft={
                <IconButton
                  iconStyle={styles.icon}
                  iconClassName="material-icons"
                  onTouchTap={this._handleClose}>close
                </IconButton>
              }
              iconElementRight={
                <FlatButton
                  style={styles.icon}
                  label="Create"
                  onTouchTap={this._handleSubmit}
                />
              }
              style={styles.bar}
            />
          </Layout>
        </Dialog>
      </div>
    )
  },

  _handleSubmit() {
    this.refs.form.submit()
    this._handleClose()
  },

  _handleClose() {
    this.context.router.goBack()
  }
})

export default Radium(AddContact)
