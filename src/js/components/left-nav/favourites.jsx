import React from 'react'
// import Reflux from 'reflux'
import {Link} from 'react-router'
import {Navigation} from 'react-mdl'

let Favourites = React.createClass({

  // mixins: [Reflux.listenTo(NavStore,'onToggle')],

  contextTypes: {
    router: React.PropTypes.func
  },

  _onLeftNavChange(e, key, payload) {
    this.context.router.transitionTo(payload.route)
  },

  render() {
    return (
      <div className="jlc-nav-section jlc-favourites">
        <div className="jlc-nav-title">Favourites</div>
        <Navigation>
          <Link><i className="material-icons">person</i> Favourite 1</Link>
          <Link><i className="material-icons">attachment</i> Favourite 1</Link>
          <Link><i className="material-icons">photo</i> Favourite 1</Link>
          <Link><i className="material-icons">message</i> Favourite 1</Link>
        </Navigation>
      </div>
    )
  }

})

export default Favourites
