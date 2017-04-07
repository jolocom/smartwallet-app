import React from 'react'
import Radium from 'radium'
import ContentCreate from 'material-ui/svg-icons/content/create'
import ContentAdd from 'material-ui/svg-icons/content/add'

import {
  List, ListItem,
  FloatingActionButton,
  Divider
} from 'material-ui'

const STYLES = {
  divider: {
    marginLeft: '16px'
  },
  addBtn: {
    width: '40px',
    boxShadow: 'none',
    marginTop: '2px'
  },
  infoHeader: {
    textAlign: 'left'
  }
}


const PlusMenu = (props) => {
  return (
    <div style={props.style}>
      <List>
        <ListItem
          key={2}
          disabled
          primaryText={props.name}
          style={STYLES.infoHeader}
          rightIcon={
            <FloatingActionButton
              mini
              secondary
              onClick={props.goToManagement}
              containerElement="label"
              style={STYLES.addBtn}>
              {props.choice ? <ContentCreate/> : <ContentAdd/>}
            </FloatingActionButton>
          } />
        <Divider style={STYLES.divider} />
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
