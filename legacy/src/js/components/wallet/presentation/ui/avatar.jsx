import PropTypes from 'prop-types';
import React from 'react'
import CameraIcon from 'material-ui/svg-icons/image/photo-camera'
import Avatar from 'material-ui/Avatar'
import {theme} from 'styles'

const STYLES = {
  marginTop: '10px'
}

const IdentityAvatar = ({style = STYLES}) => (<Avatar
  icon={<CameraIcon viewBox="-3 -3 30 30" />}
  color={theme.jolocom.gray1}
  backgroundColor={theme.jolocom.gray3}
  style={style} />)

IdentityAvatar.propTypes = {
  style: PropTypes.object
}

export default IdentityAvatar
