import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import IconButton from 'material-ui/IconButton'
import AppBar from 'material-ui/AppBar'

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
    backgroundColor: '#ffb049'
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

const EditAppBar = ({title, onSave, onClose, loading, rightTitle}) => {
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
          backgroundColor={STYLES.bar.backgroundColor}
          style={STYLES.appBarButton} hoverColor={STYLES.appBarButton.color}
          onClick={() => { loading ? null : onSave() }}>
          {loading ? 'LOADING...' : rightTitle || ''}
        </HoverButton>
      }
    />
  )
}

EditAppBar.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  rightTitle: PropTypes.string,
  loading: PropTypes.bool
}

export default Radium(EditAppBar)
