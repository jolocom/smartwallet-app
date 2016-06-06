import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import accepts from 'attr-accept'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'
import {AppBar, IconButton, TextField, Card, CardMedia, CardActions, FlatButton} from 'material-ui'

import {grey500} from 'material-ui/styles/colors'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

import Util from 'lib/util'
import GraphAgent from '../../lib/agents/graph.js'

let Profile = React.createClass({
  mixins: [
    Reflux.listenTo(ProfileStore, 'onProfileChange')
  ],

  onProfileChange: function(state) {
    this.setState(state)
  },

  componentDidUpdate(props, state) {
    if (state.show !== this.state.show) {
      if (this.state.show) {
        this.refs.dialog.show()
      } else {
        this.refs.dialog.hide()
      }
    }
  },

  show() {
    ProfileActions.show()
  },

  hide() {
    ProfileActions.hide()
  },

  getStyles() {
    let styles = {
      bar: {
        backgroundColor: grey500
      },
      content: {
        overflowY: 'auto'
      },
      main: {
        padding: '16px'
      },
      file: {
        display: 'none'
      },
      input: {
        width: '100%'
      }
    }
    return styles
  },

  render() {
    let img, styles = this.getStyles()

    let {file, imgUri} = this.state

    if (file) {
      img = URL.createObjectURL(file)
    } else if (imgUri) {
      img = imgUri
    }

    // edit mode
    return (
      <Dialog ref="dialog" fullscreen={true}>
        <Layout fixedHeader={true}>
          <AppBar
            title="Edit profile"
            style={styles.bar}
            iconElementLeft={
              <IconButton onClick={this.hide} iconClassName="material-icons">arrow_back</IconButton>
            }
            iconElementRight={
              //TODO Introduce closing the card on this click.
              <IconButton onClick={this._handleUpdate} iconClassName="material-icons">check</IconButton>
            }
          />
          <Content style={styles.content}>
            <Card zDept={0} rounded={false}>
              <CardMedia style={{height: '176px', background: `url(${img || '/img/person-placeholder.png'}) center / cover`}}>
              </CardMedia>
              <CardActions>
                {img ?
                  <FlatButton label="Remove" onClick={this._handleRemove} />
                  :
                  <FlatButton label="Select or take picture" onClick={this._handleSelect}/>
                }
              </CardActions>
            </Card>
            <input
              ref={el => this.fileInputEl = el}
              type="file"
              name="file"
              style={styles.file}
              multiple={false}
              onChange={this._handleSelectFile} />
            <main style={styles.main}>
              <section>
                <TextField floatingLabelText="First Name"
                  onChange={Util.linkToState(this, 'name')}
                  value={this.state.name}
                  style={styles.input} />
                <TextField floatingLabelText="Second Name"
                  onChange={Util.linkToState(this, 'familyName')}
                  value={this.state.familyName}
                  style={styles.input} />
                <TextField floatingLabelText="Email"
                  onChange={Util.linkToState(this, 'email')}
                  value={this.state.email}
                  style={styles.input} />
              </section>
            </main>
          </Content>
        </Layout>
      </Dialog>
    )
  },

  _handleUpdate() {
    ProfileActions.update(this.state)
  },

  _handleSelect() {
    this.fileInputEl.value = null
    this.fileInputEl.click()
  },

  _handleRemove() {
    this.fileInputEl.value = null

    if (this.state.file) {
      this.setState({
        imgUri: null,
        file: null
      })
    } else {
      this.setState({
        imgUri: null
      })
    }
  },

  _handleSelectFile({target}) {
    let gAgent = new GraphAgent()
    let file = target.files[0]
    if (!accepts(file, 'image/*')) {
      this.setState({
        error: 'Invalid file type'
      })
    } else {
      this.setState({
        error: null,
        file: file
      })
      gAgent.storeFile(null, file).then((res) => {
        console.log(res)
        this.setState({imgUri: res.url})
      })
    }
  }

})

export default Radium(Profile)
