import React from 'react'
import Radium from 'radium'
import {fade} from 'material-ui/utils/colorManipulator'
import {theme} from 'styles'
import {IconButton, AppBar} from 'material-ui'
import HoverButton from 'components/common/hover-button.jsx'

const STYLES = {
  header: {
    margin: '42px 0 16px 0'
  },
  title: {
    color: theme.palette.alternateTextColor,
    fontSize: theme.textStyles.headline.fontSize,
    fontWeight: theme.textStyles.headline.fontWeight,
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
  },
  hoverColor: fade('#a4a4a3', 0.55)
}

const EditAppBar = ({title, onSave, onClose, loading, rightTitle = 'SAVE'}) => {
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
          backgroundColor={'#fff'}
          style={STYLES.appBarButton} hoverColor={STYLES.hoverColor}
          onClick={() => { loading ? null : onSave() }}>
          {loading ? 'LOADING...' : rightTitle}
        </HoverButton>
      }
    />
  )
}

EditAppBar.propTypes = {
  title: React.PropTypes.string,
  rightTitle: React.PropTypes.string,
  children: React.PropTypes.node,
  onSave: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool
}

export default Radium(EditAppBar)
