import React from 'react'

import {Content, Block, Header} from '../../structure'
import {
  SpinnerCircular
} from './ui'

export default class Spinner extends React.Component {
  static propTypes = {
    message: React.PropTypes.array,
    style: React.PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      message: ''
    }
  }

  componentDidMount() {
    const {message} = this.props
    const loopMessage = (arr, index) => {
      if (index === arr.length) {
        return loopMessage(arr, 0)
      }
      if (this.refs.spinner) {
        this.setState({
          message: arr[index]
        })
      }
      setTimeout(loopMessage, 4000, arr, index + 1)
    }
    loopMessage(message, 0)
  }

  render() {
    return (
      <Content>
        <Header
          style={this.props.style}
          title="Thank you. We are transferring some Ether to your Account."
          />
        <Block>
          <SpinnerCircular />
        </Block>
        <Header style={this.props.style}
          ref="spinner"
          title={this.state.message} />
      </Content>
    )
  }
}
