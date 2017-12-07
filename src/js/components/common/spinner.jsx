import PropTypes from 'prop-types';
import React from 'react'
import CircularProgress from 'material-ui/CircularProgress'

import {Content, Block, Header} from '../structure'

export default class Spinner extends React.Component {
  static propTypes = {
    message: PropTypes.any,
    style: PropTypes.object,
    avatar: PropTypes.string,
    title: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      message: ''
    }
  }

  componentDidMount() {
    // const {message} = this.props
    // const loopMessage = (arr, index) => {
    //   if (index === arr.length) {
    //     return loopMessage(arr, 0)
    //   }
    //   if (this.refs.spinner) {
    //     this.setState({
    //       message: arr[index]
    //     })
    //   }
    //   setTimeout(loopMessage, 4000, arr, index + 1)
    // }
    // loopMessage(message, 0)
  }

  render() {
    return (
      <Content>
        <Header
          style={this.props.style}
          title={this.props.title}
          />
        <Block>
          <div>
            <CircularProgress size={150} thickness={8}
              style={{backgroundImage: this.props.avatar}} />
          </div>
        </Block>
        <Header style={this.props.style}
          ref="spinner"
          title={this.state.message} />
      </Content>
    )
  }
}
