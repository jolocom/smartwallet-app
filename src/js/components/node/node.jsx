import React from 'react'
import Reflux from 'reflux'
import classNames from 'classnames'

import {
  Layout,
  IconButton,
  IconToggle,
  Spacer,
  Content,
  Menu,
  MenuItem,
  Card, CardTitle, CardText, CardActions
} from 'react-mdl'

import Comments from 'components/node/comments.jsx'

import NodeActions from 'actions/node'

import NodeStore from 'stores/node'

export default React.createClass({
  mixins: [
    Reflux.connect(NodeStore)
  ],

  contextTypes: {
    history: React.PropTypes.any
  },

  getChildContext: function() {
    return {
      node: this.props.params.node
    }
  },

  componentDidMount() {
    NodeActions.load(this.props.params.node)
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

  togglePinned() {
    NodeActions.pin(this.props.params.node)
  },

  render() {
    let classes = classNames('jlc-node', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    return (
      <div className={classes}>
        <Layout>
          <header className="mdl-layout__header mdl-layout__header--transparent">
            <IconButton name="close" onClick={() => this.context.history.pushState(null, '/graph')} className="jlc-dialog__close-button"></IconButton>
            <div className="mdl-layout__header-row">
              <Spacer></Spacer>
              <nav className="mdl-navigation">
                <IconToggle name="inbox" id="node-toggle-pinned" onChange={this.togglePinned}></IconToggle>
                <IconButton name="more_vert" id="node-more"></IconButton>
                <Menu target="node-more" align="right">
                  <MenuItem>Delete</MenuItem>
                </Menu>
              </nav>
            </div>
          </header>
          <Content>
            <Card className="jlc-node-card">
              <CardTitle style={{color: '#fff', height: '176px', background: 'url(http://www.getmdl.io/assets/demos/welcome_card.jpg) center / cover'}}>Welcome</CardTitle>
              <CardText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Mauris sagittis pellentesque lacus eleifend lacinia...
              </CardText>
              <CardActions border={true}>
                <Spacer/>
                <IconButton name="comment" />
                <IconButton name="share" />
              </CardActions>
            </Card>
            <Comments node={this.props.params.node}/>
          </Content>
        </Layout>
      </div>
    )
  }
})
