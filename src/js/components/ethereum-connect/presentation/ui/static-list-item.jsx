import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import {
  ListItem
} from 'material-ui'

const STYLES = {
  iconVerified: {
    color: theme.palette.primary1Color,
    top: '20px'
  },
  icon: {
    color: theme.jolocom.gray1,
    top: '20px'
  },
  iconAvatar: {
    backgroundColor: 'none',
    borderRadius: '0%',
    top: '16px'
  },
  unverifiedListItem: {
    paddingBottom: '0px'
  },
  listItem: {
    whiteSpace: 'nowrap',
    padding: '0 16px 0 36px'
  },
  text: {
    marginRight: '8px'
  },
  textSecurity: {
    color: theme.palette.textColor
  }
}

@Radium
export default class StaticListItem extends React.Component {
  static propTypes = {
    icon: React.PropTypes.any,
    verified: React.PropTypes.bool,
    secondaryTextValue: React.PropTypes.string
  }

  render() {
    const props = this.props
    const icon = props.icon
      ? <props.icon color={props.verified ? STYLES.iconVerified.color :
      STYLES.icon.color} style={{top: '10px'}} /> : <div />

    return (
      <div style={STYLES.listItem}>
        <ListItem
          innerDivStyle={STYLES.text}
          secondaryTextLines={2}
          secondaryText={<div><p style={STYLES.textSecurity}>{props.text}</p>
            <p style={{width: '80%'}}>{props.type}</p></div>}
          leftIcon={icon}
          disabled />
      </div>
    )
  }
}
