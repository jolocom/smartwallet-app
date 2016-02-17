import React from 'react'
import Radium from 'radium'

import {
  Avatar,
  Card, CardMedia, CardHeader
} from 'material-ui'

import Verified from 'components/common/verified.jsx'

let AddressNode = React.createClass({

  getInitialState() {
    return {
      address: 'Mittelweg 50',
      city: 'Berlin',
      zipcode: '12053'
    }
  },

  contextTypes: {
    history: React.PropTypes.any
  },

  getStyles() {
    let address = `${this.state.address}, ${this.state.city}`
    let background = `http://maps.googleapis.com/maps/api/staticmap?center=${address}&zoom=15&scale=true&size=640x352&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C{$address}`

    return {
      container: {
        flex: 1
      },
      media: {
        color: '#fff',
        height: '176px',
        background: `url("${background}") center / cover`
      },
      actions: {
        display: 'flex'
      },
      content: {
        padding: '16px'
      },
      lead: {
        fontWeight: 'bold',
        marginBottom: '8px'
      },
      list: {
        listStyle: 'none',
        marginBottom: '8px'
      }
    }
  },

  render() {
    let styles = this.getStyles()

    let {address, city, zipcode} = this.state

    let subtitle = `${zipcode} ${city}`

    let avatar = <Avatar icon={<Verified/>} backgroundColor="transparent"/>

    return (
      <div style={styles.container}>
        <Card zDepth={0}>
          <CardMedia style={styles.media}/>
          <CardHeader
            title={address}
            subtitle={subtitle}
            avatar={avatar}
            />
        </Card>
        <div style={styles.content}>
          <p style={styles.lead}>The following IDs are associated with this address and verified</p>
          <ul style={styles.list}>
            <li>Agora Collective</li>
            <li>Joachim Lohkamp</li>
            <li>Christian Hildebrand</li>
            <li>… and <em>86</em> others</li>
          </ul>
        </div>
      </div>
    )
  }
})

export default Radium(AddressNode)
