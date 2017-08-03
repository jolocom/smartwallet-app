import React from 'react'
import Radium from 'radium'
import {theme} from 'styles'
import {
  NavigationExpandMore,
  NavigationExpandLess
} from 'material-ui/svg-icons'
import {
  List,
  FloatingActionButton,
  Divider
} from 'material-ui'

const STYLES = {
  divider: {
  },
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
    padding: '0 0 0 54px',
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
const PlusMenu = (props) => {
  const icon =  props.show ? <NavigationExpandLess />
    : <NavigationExpandMore />
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
          <FloatingActionButton
            mini
            secondary={!props.choice}
            onClick={props.goToManagement}
            containerElement="label"
            style={STYLES.addBtn}
            backgroundColor={props.choice ? '#FFF' : ''}
            iconStyle={props.choice ? STYLES.iconCreate : STYLES.iconAdd}>
            {props.icon}
          </FloatingActionButton>
        </div>
        {
          props.choice
          ? <div style={STYLES.accordionBtn}>
            <FloatingActionButton
              mini
              secondary={!props.choice}
              onClick={() => props.expand(!props.show)}
              containerElement="label"
              style={STYLES.addBtn}
              backgroundColor={props.choice ? '#FFF' : ''}
              iconStyle={props.choice ? STYLES.iconCreate : STYLES.iconAdd}>
            {icon}
            </FloatingActionButton>
          </div>
          : null
        }
      </List>
      {props.children}
    </div>
  )
}

PlusMenu.propTypes = {
  name: React.PropTypes.any,
  icon: React.PropTypes.node,
  children: React.PropTypes.node,
  style: React.PropTypes.object,
  goToManagement: React.PropTypes.func.isRequired,
  expand: React.PropTypes.func,
  show: React.PropTypes.bool,
  choice: React.PropTypes.bool
}

export default Radium(PlusMenu)
