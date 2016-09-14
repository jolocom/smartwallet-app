import React from 'react'
import {Drawer, List, ListItem, MakeSelectable, Divider, FontIcon} from 'material-ui'
import Header from './header.jsx'

import AccountActions from 'actions/account'

let SelectableList = MakeSelectable(List)

let Nav = React.createClass({

  contextTypes: {
    router: React.PropTypes.object,
    profile: React.PropTypes.any
  },

  getInitialState() {
    return {
      selected: 'graph'
    }
  },

  show() {
    this.refs.drawer.open()
  },

  goto(url) {
    this.context.router.push(url)
    this.refs.drawer.close()
  },

  logout() {
    AccountActions.logout()
  },

  render() {
    return (
      <Drawer ref="drawer" docked={false}>
        <Header/>
        <div>
          <SelectableList value={this.state.selected} onChange={this._handleNavChange}>
            <ListItem primaryText='Graph'
              value='graph'
              leftIcon={<FontIcon className='material-icons'>cloud</FontIcon>}/>
           </SelectableList>
           <Divider/>
           <List>
             <ListItem primaryText="Sign out"
               onTouchTap={this.logout}
               leftIcon={<FontIcon className="material-icons">exit_to_app</FontIcon>}/>
           </List>
        </div>
      </Drawer>
    )
  },

  _handleNavChange(event, selected) {
    this.setState({selected})
    this.goto(`/${selected}`)
  }

})

export default Nav
