import React from 'react'
import classNames from 'classnames'

import {
  Layout,
  IconButton,
  Spacer,
  Content,
  Menu,
  MenuItem
} from 'react-mdl'

import ContactsList from 'components/contacts/list.jsx'

export default React.createClass({

  contextTypes: {
    history: React.PropTypes.any
  },

  getInitialState() {
    return {
      open: false
    }
  },

  componentDidMount() {
    this.open()
  },

  componentWillUnmount() {
    this.close()
  },

  open() {
    this.setState({open: true})
  },

  close() {
    this.setState({open: false})
  },

  toggle() {
    this.setState({open: !this.state.open})
  },

  render() {
    let classes = classNames('jlc-chat-new', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    return (
      <div className={classes}>
        <Layout>
          <header className="mdl-layout__header mdl-layout__header--transparent">
            <IconButton name="close" onClick={() => this.context.history.pushState(null, '/chat')} className="jlc-dialog__close-button"></IconButton>
            <div className="mdl-layout__header-row">
              <Spacer></Spacer>
              <nav className="mdl-navigation">
                <IconButton name="search" onClick={this.showSearch}/>
                <IconButton name="more_vert" id="node-more"></IconButton>
                <Menu target="node-more" align="right">
                  <MenuItem>Invite a friend</MenuItem>
                </Menu>
              </nav>
            </div>
          </header>
          <Content>
            <ContactsList/>
          </Content>
        </Layout>
      </div>
    )
  }
})
