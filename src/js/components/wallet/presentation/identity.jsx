import React from 'react'
import Radium from 'radium'

const STYLES = {
}

@Radium
export default class WalletIdentity extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (<div>
      Identity<br />
      {/* <Link to="/wallet/identity/contact"></Link> */}
    </div>)
  }
}
