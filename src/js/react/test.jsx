// This component is only meant for test purposes
import React from 'react/addons'
import WebAgent from '../lib/web-agent.js'

let Test = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      webid: '#',
      input: ''
    }
  },
  componentDidMount: function() {
    // who am I? (check 'User' header)
    WebAgent.head(document.location.origin)
      .then((xhr) => {
        console.log('head')
        console.log(xhr)
        let webid = xhr.getResponseHeader('User')
        this.setState({
          webid: webid,
          input: this.state.input
        })
      })
  },
  onButtonClick: function() {
    console.log('Oh you...')
    console.log(this.state.input)
  },
  render: function() {
    return (
      <div className="profile">
        <h1>{this.state.webid}</h1>
        <input type="text" valueLink={this.linkState('input')}></input>
        <div className="profile-edit" onClick={this.onButtonClick}>
          Do not click this under any circumstance
        </div>
      </div>
    )
  }
})

export default Test
