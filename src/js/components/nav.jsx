import React from 'react'

import {Tabs, Tab} from 'material-ui'

export default React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },

  _handleTabsChange(tab) {
    this.context.router.push(`/${tab}`)
  },

  render() {
    return (
      <Tabs valueLink={{value: this.props.activeTab, requestChange: this._handleTabsChange}} {...this.props}>
        <Tab label="Graph" value="graph"/>
      </Tabs>
    )
  }

})
