import PropTypes from 'prop-types';
import React from 'react'

import Tab from 'material-ui/Tab'
import Tabs from 'material-ui/Tab'

export default class extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    activeTab: PropTypes.any
  };

  _handleTabsChange = (tab) => {
    this.context.router.push(`/${tab}`)
  };

  render() {
    return (
      <Tabs valueLink={{
        value: this.props.activeTab,
        requestChange: this._handleTabsChange
      }} {...this.props}>
        <Tab label="Graph" value="graph" />
      </Tabs>
    )
  }
}
