import React from 'react'
// import {Link} from 'react-router'

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
        <Tab label="Contacts" value="contacts"/>
      </Tabs>
    )
  }

})

// <div className="mdl-layout__tab-bar mdl-js-ripple-effect is-casting-shadow">
//   <Link to="/graph" activeClassName="is-active" className="mdl-layout__tab"><i className="material-icons">share</i></Link>
//   <Link to="/chat" activeClassName="is-active" className="mdl-layout__tab"><i className="material-icons">chat</i></Link>
//   <Link to="/contacts" activeClassName="is-active" className="mdl-layout__tab"><i className="material-icons">contacts</i></Link>
//   <Link to="/projects" activeClassName="is-active" className="mdl-layout__tab"><i className="material-icons">folder</i></Link>
// </div>
