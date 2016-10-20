import React from 'react'
import Radium from 'radium'
import BitcoinIcon from 'components/icons/bitcoin-icon.jsx'
import PersonIcon from 'components/icons/person-icon.jsx'
import DocIcon from 'components/icons/doc-icon.jsx'
import EventIcon from 'components/icons/event-icon.jsx'
import AppIcon from 'components/icons/app-icon.jsx'
import AudioIcon from 'components/icons/audio-icon.jsx'
import InstitutionIcon from 'components/icons/institution-icon.jsx'
import ThingIcon from 'components/icons/thing-icon.jsx'
import SensorIcon from 'components/icons/sensor-icon.jsx'
import ImageIcon from 'components/icons/image-icon.jsx'
import VideoIcon from 'components/icons/video-icon.jsx'
import ConfidIcon from 'components/icons/confid-icon.jsx'
import NoteIcon from 'components/icons/note-icon.jsx'

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
      case 'institution':
        return <InstitutionIcon style={styles.icon} />
      case 'event':
        return <EventIcon style={styles.icon} />
      case 'thing':
        return <ThingIcon style={styles.icon} />
      case 'app':
        return <AppIcon style={styles.icon} />
      case 'sensor':
        return <SensorIcon style={styles.icon} />
      case 'image':
        return <ImageIcon style={styles.icon} />
      case 'video':
        return <VideoIcon style={styles.icon} />
      case 'audio':
        return <AudioIcon style={styles.icon} />
      case 'confidential':
        return <ConfidIcon style={styles.icon} />
      case 'document':
        return <DocIcon style={styles.icon} />
      case 'note':
        return <NoteIcon style={styles.icon} />
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
