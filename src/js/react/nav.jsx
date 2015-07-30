import React from 'react'

class Nav extends React.Component {
  render() {
    return (
      <div id="status-bar">
        { /* TODO picture*/ }
        <img className="status-bar-img" src="#"/>
        <span className="status-bar-text">You are logged in as </span>
        <a className="status-bar-profile-link" href="#">foo</a>
        <span className="status-bar-graph-text"> Here is your </span>
        <a className="status-bar-graph-link" href="#">graph</a>
      </div>
    )
  }
}


export default Nav
