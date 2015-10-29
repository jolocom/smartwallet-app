import React from 'react'
import classNames from 'classnames'

import {Layout, Content, Textfield, IconButton, Spacer} from 'react-mdl'

import NodeActions from 'actions/node'

import {linkToState} from 'lib/util'

export default React.createClass({

  contextTypes: {
    history: React.PropTypes.any,
    node: React.PropTypes.string
  },

  getInitialState() {
    return {
      show: false
    }
  },

  componentDidMount() {
    this.show()
  },

  show() {
    this.setState({
      show: true
    })
  },

  close() {
    this.context.history.goBack()
  },

  onSubmit() {
    NodeActions.add(this.props.params.node, 'https://localhost:8443/eelco/profile/card#me', {
      title: this.state.title,
      description: this.state.description
    }).then(() => {
      this.close()
    })
  },

  render: function() {
    let classes = classNames('jlc-node-add', 'jlc-dialog' , 'jlc-dialog__fullscreen', {
      'is-opened': this.state.show
    })

    let type = this.props.params.type

    return (
      <div className={classes}>
        <Layout fixedHeader={true}>
          <header className="mdl-layout__header mdl-color--grey-600 is-casting-shadow">
            <IconButton name="arrow_back" onClick={this.close} className="jlc-dialog__close-button"></IconButton>
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">Add {type}</span>
              <Spacer></Spacer>
              <nav className="mdl-navigation">
                <IconButton name="check" onClick={this.onSubmit}/>
              </nav>
            </div>
          </header>
          <Content>
            <Textfield label="Title"
              onChange={linkToState(this, 'title')}
              floatingLabel={true} />
            <Textfield label="Description"
              onChange={linkToState(this, 'description')}
              floatingLabel={true} />
          </Content>
        </Layout>
      </div>
    )
  }
})
