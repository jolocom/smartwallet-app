import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'
import {theme} from 'styles'

import List from 'material-ui/List'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Divider from 'material-ui/Divider'

const STYLES = {
  divider: {
  },
  addBtn: {
    position: 'absolute',
    top: '11px',
    right: '8px'
  },
  iconAdd: {
  },
  infoHeader: {
    textAlign: 'left',
    color: theme.textStyles.sectionheader.color,
    fontSize: theme.textStyles.sectionheader.fontSize,
    fontWeight: theme.textStyles.sectionheader.fontWeight,
    marginBottom: '15px',
    display: 'inline-block'
  },
  item: {
    alignItems: 'center',
    paddingLeft: '16px',
    display: 'inline-block',
    verticalAlign: 'top',
    width: '100%',
    boxSizing: 'border-box'
  },
  root: {
    position: 'relative',
    width: '100%',
    whiteSpace: 'nowrap'
  }

}
const SubMenuIcon = (props) => (<div style={{...STYLES.root, ...props.style}}>
  <List>
    <div style={STYLES.item}>
      <div style={STYLES.infoHeader}>
      {props.name}
      </div>
      <Divider style={STYLES.divider} />
    </div>
    <div style={STYLES.addBtn}>
      <FloatingActionButton
        mini
        secondary={false}
        onClick={props.onClick}
        containerElement="label"
        style={STYLES.addBtn}
        backgroundColor="#FFF"
        iconStyle={STYLES.iconAdd}>
        {props.icon}
      </FloatingActionButton>
    </div>
  </List>
</div>)

SubMenuIcon.propTypes = {
  name: PropTypes.any,
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.object
}

export default Radium(SubMenuIcon)
