import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import {
  IconButton,
  Card, CardMedia, CardTitle, CardActions
} from 'material-ui'

import {Spacer} from 'components/layout'

import Comments from 'components/node/comments.jsx'

import ProfileActions from 'actions/profile'

import ProfileStore from 'stores/profile'

let ProfileNode = React.createClass({
  mixins: [
    Reflux.connect(ProfileStore)
  ],

  contextTypes: {
    history: React.PropTypes.any
  },

  componentDidMount() {
    ProfileActions.load()
  },

  getStyles() {
    let background = 'http://www.getmdl.io/assets/demos/welcome_card.jpg'

    if (this.imgUri) {
      background = this.imageUri
    }

    return {
      container: {
        flex: 1
      },
      media: {
        color: '#fff',
        height: '176px',
        background: `url(${background}) center / cover`
      },
      actions: {
        display: 'flex'
      },
      comments: {
        flex: 1
      }
    }
  },

  render() {
    let styles = this.getStyles()

    let {name} = this.state

    return (
      <div style={styles.container}>
        <Card zDepth={0}>
          <CardMedia overlay={
              <CardTitle>{name}</CardTitle>
          } style={styles.media}/>
          <CardActions style={styles.actions}>
            <Spacer/>
            <IconButton iconClassName="material-icons">comment</IconButton>
            <IconButton iconClassName="material-icons">share</IconButton>
          </CardActions>
        </Card>
        <Comments node={this.props.node} style={styles.comments}/>
      </div>
    )
  }
})

export default Radium(ProfileNode)
