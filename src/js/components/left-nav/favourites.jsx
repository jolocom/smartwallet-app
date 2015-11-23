import React from 'react'
import {Link} from 'react-router'

let Favourites = React.createClass({

  render() {
    return (
      <div className="jlc-nav-section jlc-favourites">
        <div className="jlc-nav-title">Favourites</div>
        <nav>
          <Link to="/graph/n/fav1"><i className="material-icons">person</i> Favourite 1</Link>
          <Link to="/graph/n/fav2"><i className="material-icons">attachment</i> Favourite 2</Link>
          <Link to="/graph/n/fav3"><i className="material-icons">photo</i> Favourite 3</Link>
          <Link to="/graph/n/fav4"><i className="material-icons">message</i> Favourite 4</Link>
        </nav>
      </div>
    )
  }

})

export default Favourites
