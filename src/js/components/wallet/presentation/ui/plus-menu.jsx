import React from 'react'
import Radium from 'radium'
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
    marginTop: '27px'
  },
  infoHeader: {
    textAlign: 'left'
  }
}

const PlusMenu = ({name, style, children, ...props}) => {
  return (
    <div style={Object.assign({}, STYLES, style)} {...props}>
      <List>
        <ListItem
          key={2}
          disabled
          primaryText={name}
          style={STYLES.infoHeader}
          rightIcon={
            <FloatingActionButton
              mini
              secondary
              containerElement="label"
              style={STYLES.addBtn}>
              <ContentAdd />
            </FloatingActionButton>
          } />
        <Divider style={STYLES.divider} />
      </List>
      {children}
    </div>
  )
}

PlusMenu.propTypes = {
  name: React.PropTypes.any,
  children: React.PropTypes.node,
  style: React.PropTypes.object
}

export default Radium(PlusMenu)
