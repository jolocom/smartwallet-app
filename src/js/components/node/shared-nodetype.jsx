import React from 'react'
import Radium from 'radium'
import {IconButton} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import {GridList, GridTile} from 'material-ui/GridList'
import BitcoinIcon from 'components/icons/bitcoin-icon.jsx'

let SharedNodeType = React.createClass({

  getStyles() {
    let styles = {
      container: {
        height: '100px',
        width: '100px'
      },
      circle: {
        height: '50px',
        width: '50px',
        backgroundColor: '#ff0000'
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()

    return (
      <div style={styles.container}>
        <div style={styles.circle}>
          <BitcoinIcon />
        </div>
      </div>
    )
  }
})

export default Radium(SharedNodeType)
