import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import {IconButton, AppBar} from 'material-ui'
import HoverButton from 'components/common/hover-button.jsx'

const STYLES = {
  header: {
    margin: '42px 0 16px 0'
  },
  title: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '300',
    margin: 0
  },
  bar: {
    backgroundColor: theme.palette.primary1Color
  },
  appBarButton: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    margin: 'auto',
    borderRadius: '2px',
    padding: '16px',
    color: '#fff'
  }
}

const EditAppBar = ({title, onSave, onClose}) => {
  return (
    <AppBar
      title={title}
      titleStyle={STYLES.title}
      style={STYLES.bar}
      iconElementLeft={
        <IconButton
          iconStyle={{color: STYLES.appBarButton.color}}
          color={STYLES.appBarButton.color}
          onClick={() => { onClose() }}
          iconClassName="material-icons">close</IconButton>
      }
      iconElementRight={
        <HoverButton
          backgroundColor={theme.palette.primary1Color}
          style={STYLES.appBarButton} hoverColor={STYLES.appBarButton.color}
          onClick={() => { onSave() }}>SAVE</HoverButton>
      }
    />
  )
}

EditAppBar.propTypes = {
  title: React.PropTypes.string,
  children: React.PropTypes.node,
  onSave: React.PropTypes.func,
  onClose: React.PropTypes.func
}

export default Radium(EditAppBar)
