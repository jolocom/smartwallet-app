import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/contact'

@connect({
  props: []
})
export default class WalletContactScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    contact: React.PropTypes.object,
    onChange: React.PropTypes.func,
    focused: React.PropTypes.string,
    setFocused: React.PropTypes.func
  }
  constructor() {
    super()

    this.state = {
      contact: {
        id: 'email1',
        emails: [
          'a@a.com',
          'b@b.com'
        ]
      },
      focused: 'email1',
      onChange: () => { null },
      onFocusChange: (value) => {
        this.setState({focused: value})
      }
    }
  }
  render() {
    return (
      <Presentation
        contact={this.state.contact}
        onChange={this.state.onChange}
        focused={this.state.focused}
        onFocusChange={this.state.onFocusChange}
      />
    )
  }
}
