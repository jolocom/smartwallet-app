import React from 'react'
import {History} from 'react-router'
import classNames from 'classnames'

import {Layout, IconButton, IconToggle, Spacer, Content, Menu, MenuItem} from 'react-mdl'

let Node = React.createClass({
  mixins: [History],

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

    let classes = classNames('jlc-node', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    return (
      <div className={classes}>
        <Layout fixedHeader={true}>
          <header className="mdl-layout__header is-casting-shadow">
            <IconButton name="close" onClick={() => this.history.pushState(null, '/graph')} className="jlc-dialog__close-button"></IconButton>
            <div className="mdl-layout__header-row">
              <Spacer></Spacer>
              <nav className="mdl-navigation">
                <IconToggle name="inbox"></IconToggle>
                <IconButton name="more_vert" id="node-more"></IconButton>
                <Menu target="node-more" align="right">
                  <MenuItem>Delete</MenuItem>
                </Menu>
              </nav>
            </div>
          </header>
          <Content>

          </Content>
        </Layout>
      </div>
    )
  }
})

export default Node
