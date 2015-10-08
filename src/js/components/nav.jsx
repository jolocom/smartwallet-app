import React from 'react'
import {Link} from 'react-router'

let AppNav = React.createClass({

  render() {
    return (
      <div className="mdl-layout__tab-bar mdl-js-ripple-effect is-casting-shadow">
        <Link to="/graph" activeClassName="is-active" className="mdl-layout__tab"><i className="material-icons">share</i></Link>
        <Link to="/chat" activeClassName="is-active" className="mdl-layout__tab"><i className="material-icons">chat</i></Link>
        <Link to="/contacts" activeClassName="is-active" className="mdl-layout__tab"><i className="material-icons">contacts</i></Link>
        <Link to="/projects" activeClassName="is-active" className="mdl-layout__tab"><i className="material-icons">folder</i></Link>
      </div>
    )
  }

})

export default AppNav
