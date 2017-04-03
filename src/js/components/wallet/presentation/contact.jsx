import React from 'react'
import Radium from 'radium'

const STYLES = {
}

@Radium
export default class WalletContact extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onSubmit: React.PropTypes.func.isRequired
  }

  render() {
    return (<div onClick={this.props.onSubmit}>
      Contact
    </div>)
  }
}
