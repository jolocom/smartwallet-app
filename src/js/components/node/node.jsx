import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import classNames from 'classnames'

import {
  AppBar,
  IconButton,
  Checkbox,
  Card, CardMedia, CardTitle, CardActions
} from 'material-ui'

import {Layout, Content, Spacer} from 'components/layout'

import Comments from 'components/node/comments.jsx'

import NodeActions from 'actions/node'

import NodeStore from 'stores/node'

let Node = React.createClass({
  mixins: [
    Reflux.connect(NodeStore)
  ],

  contextTypes: {
    history: React.PropTypes.any
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

  getStyles() {
    return {
      bar: {
        position: 'absolute',
        backgroundColor: 'transparent'
      },
      media: {
        color: '#fff',
        height: '176px',
        background: 'url(http://www.getmdl.io/assets/demos/welcome_card.jpg) center / cover'
      },
      actions: {
        display: 'flex'
      }
    }
  },

  render() {
    let classes = classNames('jlc-node', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    let styles = this.getStyles()

    return (
      <div className={classes}>
        <Layout>
          <AppBar
            iconElementLeft={<IconButton onTouchTap={() => this.context.history.pushState(null, '/graph')} iconClassName="material-icons">close</IconButton>}
            iconElementRight={<Checkbox name="inbox" onChange={this.togglePinned}></Checkbox>}
            style={styles.bar}
            zDepth={0}
          />
          <Content>
            <Card className="jlc-node-card" zDepth={0}>
              <CardMedia overlay={
                  <CardTitle>Welcome</CardTitle>
              } style={styles.media}/>
              <CardActions style={styles.actions}>
                <Spacer/>
                <IconButton iconClassName="material-icons">comment</IconButton>
                <IconButton iconClassName="material-icons">share</IconButton>
              </CardActions>
            </Card>
            <Comments node={this.props.params.node}/>
          </Content>
        </Layout>
      </div>
    )
  }
})

export default Radium(Node)
