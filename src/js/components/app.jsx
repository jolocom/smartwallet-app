import React from 'react'
import {Layout, Header, HeaderRow, Content} from 'react-mdl'

import LeftNav from 'components/left-nav/nav.jsx'
import Profile from 'components/accounts/profile.jsx'

import AppNav from 'components/nav.jsx'
import GraphNav from 'components/graph/nav.jsx'
import GraphSearch from 'components/graph/search.jsx'

import ChatNav from 'components/chat/nav.jsx'

import ContactsNav from 'components/contacts/nav.jsx'

import ProjectsNav from 'components/projects/nav.jsx'

let components = {
  '/graph': {
    title: 'Graph',
    nav: <GraphNav/>,
    search: <GraphSearch/>
  },
  '/chat': {
    title: 'Chat',
    nav: <ChatNav/>
  },
  '/contacts': {
    title: 'Contacts',
    nav: <ContactsNav/>
  },
  '/projects': {
    title: 'Projects',
    nav: <ProjectsNav/>
  }
}

let App = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState() {
    return this.getComponent()
  },

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname)
      this.setState(this.getComponent())
  },

  getComponent() {
    return components[this.props.location.pathname]
  },

  render() {
    return (
      <div className="jlc-app">
        <Layout fixedHeader={true} fixedTabs={true}>
          <Header className="jlc-app-header">
            <HeaderRow title={this.state.title}>
              {this.state.nav}
            </HeaderRow>
            <AppNav/>
          </Header>
          {this.state.search}
          <LeftNav/>
          <Content>
            {this.props.children}
          </Content>
        </Layout>
        <Profile/>
      </div>
    )
  }

})

export default App
