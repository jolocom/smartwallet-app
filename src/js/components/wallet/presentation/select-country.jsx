import React from 'react'
import Radium from 'radium'
import {AutoComplete, FlatButton} from 'material-ui'

@Radium
export default class WalletComingSoon extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    message: React.PropTypes.string,
    dataSource: React.PropTypes.Object.isRequired,
    submit: React.PropTypes.func.isRequired,
    change: React.PropTypes.func.isRequired,
    value: React.PropTypes.string.isRequired,
    dataSourceConfig: React.PropTypes.Object.isRequired
  }

  render() {
    const {dataSource, dataSourceConfig, submit, change, value} = this.props
    return (
      <div>
        <AutoComplete
          floatingLabelText="Same text, different values"
          openOnFocus
          dataSource={dataSource}
          onChange={change}
          value={value}
          dataSourceConfig={dataSourceConfig} />
        <FlatButton onClick={() => submit(value)} />
      </div>
    )
  }
}
