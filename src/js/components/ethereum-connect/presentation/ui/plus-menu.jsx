import React from 'react'
import Radium from 'radium'
import {theme} from 'styles'

import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'

import List from 'material-ui/List'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Divider from 'material-ui/Divider'

import {IconCheckmark} from '../../../common'

const STYLES = {
  addBtn: {
    position: 'absolute',
    top: '12.5px',
    right: '8px'
  },
  accordionBtn: {
    position: 'absolute',
    top: '12.5px',
    right: '56px'
  },
  iconCreate: {
    fill: theme.palette.accent1Color
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
    padding: '0 0 0 36px',
    display: 'inline-block',
    verticalAlign: 'top',
    width: '100%',
    boxSizing: 'border-box'
  },
  root: {
    position: 'relative',
    width: '100%',
    whiteSpace: 'nowrap'
  },
  securityLevel: {
    paddingLeft: '8px',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemSecurity: {
    order: 1,
    padding: '8px'
  }
}
const PlusMenu = (props) => {
  const icon = props.expanded ? <NavigationExpandLess />
    : <NavigationExpandMore />
  const renderSecurityIcons = props.securityDetails.map((item, index) => {
    return (
      <IconCheckmark
        key={index}
        style={STYLES.itemSecurity}
        color={item.verified ? theme.palette.primary1Color
          : theme.jolocom.gray1} />
    )
  })
  return (
    <div style={Object.assign(STYLES.root, props.style)}>
      <List>
        <div style={STYLES.item}>
          <div style={STYLES.infoHeader}>
          {props.name}
            <div style={STYLES.securityLevel}>
              {renderSecurityIcons}
            </div>
          </div>
          <Divider style={STYLES.divider} />
        </div>
        <div style={STYLES.addBtn}>
          <FloatingActionButton
            mini
            secondary={!props.choice}
            onClick={() => props.toggle(!props.expanded)}
            containerElement="label"
            style={STYLES.addBtn}
            backgroundColor={'#FFF'}
            iconStyle={STYLES.iconCreate}>
            {icon}
          </FloatingActionButton>
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
  expand: React.PropTypes.func,
  expanded: React.PropTypes.bool,
  choice: React.PropTypes.bool
}

export default Radium(PlusMenu)
