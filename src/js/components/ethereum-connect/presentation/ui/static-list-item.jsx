import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import {theme} from 'styles'
import {ListItem} from 'material-ui/List'

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
    padding: '0 16px 0 36px'
  },
  text: {
    marginRight: '8px'
  },
  textSecurity: {
    fontSize: '14px'
  }
}

@Radium
export default class StaticListItem extends React.Component {
  static propTypes = {
    icon: PropTypes.any,
    verified: PropTypes.bool,
    secondaryTextValue: PropTypes.string
  }

  render() {
    const props = this.props
    const icon = props.icon
      ? <props.icon color={props.verified ? STYLES.iconVerified.color
      : STYLES.icon.color} style={{top: '10px'}} /> : <div />

    return (
      <div style={STYLES.listItem}>
        <ListItem
          innerDivStyle={STYLES.text}
          primaryText={<p style={STYLES.textSecurity}>{props.type}</p>}
          secondaryTextLines={2}
          secondaryText={<div>
            <p>{props.text}</p></div>}
          leftIcon={icon}
          disabled />
      </div>
    )
  }
}
