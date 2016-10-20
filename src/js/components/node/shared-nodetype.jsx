import React from 'react'
import Radium from 'radium'
import BitcoinIcon from 'components/icons/bitcoin-icon.jsx'
import PersonIcon from 'components/icons/person-icon.jsx'
import DocIcon from 'components/icons/doc-icon.jsx'

let SharedNodeType = React.createClass({

  propTypes: {
    type: React.PropTypes.string,
    color: React.PropTypes.string
  },

  // Returns the icon for the specified node type
  _getNodeTypeIcon(nodeType) {
    let styles = this.getStyles()
    switch (nodeType) {
      case 'person':
        return <PersonIcon style={styles.icon} />
      case 'event':
        return <DocIcon style={styles.icon} />
      default:
        return <BitcoinIcon style={styles.icon} />
    }
  },

  getStyles() {
    let styles = {
      container: {
        height: '100px',
        width: '100px'
      },
      circle: {
        height: '50px',
        width: '50px',
        backgroundColor: `${this.props.color}`,
        borderRadius: '50%'
      },
      icon: {
        width: '25',
        height: '25',
        marginTop: '10'
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()
    let icon = this._getNodeTypeIcon(this.props.type)
    return (
      <div style={styles.container} type={this.props} color={this.props}>
        <div style={styles.circle}>
          {icon}
        </div>
      </div>
    )
  }
})

export default Radium(SharedNodeType)
