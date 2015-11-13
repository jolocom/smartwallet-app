import React from 'react'
import Reflux from 'reflux'
import _ from 'lodash'
import {History} from 'react-router'
import {Layout, Header, HeaderRow, Content} from 'react-mdl'

import LeftNav from 'components/left-nav/nav.jsx'
import Profile from 'components/accounts/profile.jsx'

import AppNav from 'components/nav.jsx'
import GraphNav from 'components/graph/nav.jsx'
import GraphSearch from 'components/graph/search.jsx'

import ChatNav from 'components/chat/nav.jsx'

import ContactsNav from 'components/contacts/nav.jsx'

import ProjectsNav from 'components/projects/nav.jsx'

import AvailabilityDevStore from 'stores/availability-dev'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

export default React.createClass({

  mixins: [
    History,
    Reflux.connect(AvailabilityDevStore),
    Reflux.connect(ProfileStore, 'profile')
  ],

  childContextTypes: {
    profile: React.PropTypes.any
  },

  getChildContext: function () {
    console.log('context', this.state.profile)
    return {
      profile: this.state.profile
    }
  },

  componentWillMount() {
    ProfileActions.load()

    let path = this.props.location.pathname
    if (!this.state.signedUp && path !== 'signup') {
      this.history.pushState(null, '/signup')
    } else if (path === '/') {
      this.history.pushState(null, '/graph')
    }
  },

  getComponent() {
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
    return _.find(components, (component, path) => {
      return this.props.location.pathname.match(path)
    }) || {}
  },

  render() {
    let component = this.getComponent()

    return (
      <div className="jlc-app">
        {this.state.signedUp ? (
          <Layout fixedHeader={true} fixedTabs={true}>
            <Header className="jlc-app-header">
              <HeaderRow title={component.title}>
                {component.nav}
              </HeaderRow>
              <AppNav/>
            </Header>
            <LeftNav/>
            <Content>
              {this.props.children}
            </Content>
            <Profile/>
          </Layout>
        ) : this.props.children}
        {component.search}
      </div>
    )
  }

})
