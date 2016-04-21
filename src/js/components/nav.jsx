import React from 'react'

import {Tabs, Tab} from 'material-ui'

export default React.createClass({

  contextTypes: {
    history: React.PropTypes.any
  },

  _handleTabsChange(tab) {
    this.context.history.pushState(null, `/${tab}`)
  },

  render() {
    return (
      <Tabs valueLink={{value: this.props.activeTab, requestChange: this._handleTabsChange}} {...this.props}>
        <Tab label="Graph" value="graph"/>
        <Tab label="Chat" value="chat"/>
        <Tab label="Contact" value="contacts"/>
      </Tabs>
    )
  }

})
