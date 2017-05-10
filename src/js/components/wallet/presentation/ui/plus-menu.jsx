import React from 'react'
import Radium from 'radium'
import ContentCreate from 'material-ui/svg-icons/content/create'
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle'
import {theme} from 'styles'

import {
  List,
  IconButton,
  Divider
} from 'material-ui'

const STYLES = {
  divider: {
    width: '150%'
  },
  addBtn: {
    width: '40px',
    boxShadow: 'none',
    padding: '6px',
    display: 'inline-block',
    verticalAlign: 'center',
    color: theme.jolocom.gray4,
    marginLeft: '20px',
    transition: 'none'
  },
  iconCreate: {
    height: '30px',
    width: '30px',
    backgroundColor: theme.jolocom.gray4,
    borderRadius: '20px',
    boxShadow: '3px 3px 3px #c3c6cc',
    color: theme.palette.accent1Color,
    padding: '5px',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  },
  iconAdd: {
    height: '40px',
    width: '40px',
    color: theme.palette.accent1Color,
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  },
  infoHeader: {
    textAlign: 'left',
    color: theme.palette.textColor,
    marginBottom: '15px',
    display: 'inline-block'
  },
  item: {
    alignItems: 'center',
    marginLeft: '16px',
    display: 'inline-block',
    verticalAlign: 'top',
    width: '70%'
  },
  root: {
    width: '100%',
    maxWidth: '800px',
    whiteSpace: 'nowrap'
  }

}
const PlusMenu = (props) => {
  return (
    <div style={Object.assign(STYLES.root, props.style)}>
      <List>
        <div style={STYLES.item}>
          <div style={STYLES.infoHeader}>
          {props.name}
          </div>
          <Divider style={STYLES.divider} />
        </div>
        <div style={STYLES.addBtn}>
          <IconButton
            onClick={props.goToManagement}
            containerElement="label"
            style={STYLES.addBtn}
            iconStyle={props.choice ? STYLES.iconCreate : STYLES.iconAdd}>
            {props.choice
            ? <ContentCreate color={STYLES.iconCreate.color} />
            : <ContentAddCircle color={STYLES.iconAdd.color} />}
          </IconButton>
        </div>
      </List>
      {props.children}
    </div>
  )
}

PlusMenu.propTypes = {
  name: React.PropTypes.any,
  children: React.PropTypes.node,
  style: React.PropTypes.object,
  goToManagement: React.PropTypes.func.isRequired,
  choice: React.PropTypes.bool
}

export default Radium(PlusMenu)
