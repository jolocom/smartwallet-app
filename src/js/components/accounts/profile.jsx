import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import accepts from 'attr-accept'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'
import {
  AppBar,
  IconButton,
  TextField,
  Card,
  CardMedia,
  CardActions,
  FlatButton
} from 'material-ui'

import {grey500} from 'material-ui/styles/colors'
import ActionDescription from 'material-ui/svg-icons/action/description'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import EditorAttachMoney from 'material-ui/svg-icons/editor/attach-money'
import ActionFingerprint from 'material-ui/svg-icons/action/fingerprint'

import GraphStore from 'stores/graph-store'
import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

import Util from 'lib/util'
import GraphAgent from '../../lib/agents/graph.js'

let Profile = React.createClass({
  mixins: [
    Reflux.listenTo(ProfileStore, 'onProfileChange'),
  ],

  onProfileChange: function(state) {
    this.setState(state)
  },

  componentDidMount(){
    this.loading = false
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
      image: {
        height: '176px'
      },
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
      },
      formTable: {
        width: '100%'
      },
      iconCell: {
        verticalAlign: 'bottom',
        textAlign: 'right',
        paddingRight: '10px'
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
      img = Util.uriToProxied(imgUri)
    }
    
    let bgImg = img || '/img/person-placeholder.png'
    return (
      <Dialog ref="dialog" fullscreen={true}>
        <Layout fixedHeader={true}>
          <AppBar
            title="Edit profile"
            style={styles.bar}
            iconElementLeft={
              <IconButton
                onClick={this.hide}
                iconClassName="material-icons">arrow_back</IconButton>
            }
            iconElementRight={
							!this.state.loading ?
								<IconButton
								onClick={this._handleUpdate}
								iconClassName="material-icons">check</IconButton>
							:
 								<IconButton  iconClassName="material-icons">hourglass_empty</IconButton>
            }
          />
          <Content style={styles.content}>
            <Card zDept={0} rounded={false}>
              <CardMedia
                style={Object.assign({},
                  styles.image,
                  {background: `url(${bgImg}) center / cover`}
                )} />
              <CardActions>
                {img ?
                  <FlatButton label="Remove" onClick={this._handleRemove} />
                  :
                  <FlatButton label="Select or take picture"
                  onClick={this._handleSelect}/>
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
            <input
              ref={el => this.passportFileInputEl = el}
              type="file"
              name="passportfile"
              style={styles.file}
              multiple={false}
              onChange={this._handleSelectPassportFile} />
            <main style={styles.main}>
              <section>
                <table style={styles.formTable}>
                  <tr>
                    <td style={styles.iconCell}><ActionDescription /></td>
                    <td>
                      <TextField floatingLabelText="First Name"
                        onChange={Util.linkToState(this, 'givenName')}
                        value={this.state.givenName}
                        style={styles.input} />
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.iconCell}><ActionDescription /></td>
                    <td>
                      <TextField floatingLabelText="Second Name"
                        onChange={Util.linkToState(this, 'familyName')}
                        value={this.state.familyName}
                        style={styles.input} />
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.iconCell}><CommunicationEmail /></td>
                    <td>
                      <TextField floatingLabelText="Email"
                        onChange={Util.linkToState(this, 'email')}
                        value={this.state.email}
                        style={styles.input} />
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.iconCell}><ActionFingerprint /></td>
                    <td>
                      <TextField floatingLabelText="Passport"
                                 onChange={Util.linkToState(this, 'passport')}
                                 value={this.state.passport}
                                 style={styles.childImg} />
                      <FlatButton label="Upload passport"
                  onClick={this._handleSelectPassport}/>
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.iconCell}><EditorAttachMoney /></td>
                    <td>
                      <TextField floatingLabelText="Bitcoin Address"
                        onChange={Util.linkToState(this, 'bitcoinAddress')}
                        value={this.state.bitcoinAddress}
                        style={styles.input} />
                    </td>
                  </tr>
                </table>
              </section>
            </main>
          </Content>
        </Layout>
      </Dialog>
    )
  },

  _handleUpdate() {
    if (!this.loading) {
      this.hide()
      ProfileActions.update(Object.assign({},this.state, {show:false}))
    }
  },

  _handleSelect() {
    this.fileInputEl.value = null
    this.fileInputEl.click()
  },
  
  _handleSelectPassport() {
    this.passportFileInputEl.value = null
    this.passportFileInputEl.click()
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
				loading: true
			})
      this.setState({
        error: null,
        file: file
      })

      gAgent.storeFile(this.state.storage, file).then((res) => {
				this.setState({
					loading: false
				})
        this.setState({imgUri: res})
      }).catch((e)=>{
        console.log(e)
      })
    }
  },

  _handleSelectPassportFile({target}) {

    let gAgent = new GraphAgent()
    let file = target.files[0]
    if (!accepts(file, 'image/*')) {
      this.setState({
        error: 'Invalid file type'
      })
    } else {
      this.setState({
				loading: true
			})
      this.setState({
        error: null,
        passportFile: file
      })

      gAgent.storeFile(this.state.storage, file).then((res) => {
				this.setState({
					loading: false
				})
        this.setState({passportImgUri: res})
      }).catch((e)=>{
        console.log(e)
      })
    }
  }

})

export default Radium(Profile)
