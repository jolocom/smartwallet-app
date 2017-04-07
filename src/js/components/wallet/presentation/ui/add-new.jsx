import React from 'react'
import Radium from 'radium'
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle'
import {theme} from 'styles'

import {
  IconButton,
  Divider
} from 'material-ui'

const STYLES = {
  divider: {
    marginLeft: '16px'
  },
  addBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    boxShadow: 'none',
    padding: '5px',
    display: 'inline-block',
    margin: '10px'

  },
  infoHeader: {
    display: 'inline-block',
    textAlign: 'left',
    color: theme.jolocom.gray2,
    left: '10px',
    paddingBottom: '10px',
    verticalAlign: 'middle'
  },
  icon: {
    width: '10px',
    height: '10px'
  },
  list: {
    paddingLeft: '50px'
  }
}
const AddNew = ({value, onClick}) => {
  return (
    <div style={STYLES.list} >
      <IconButton
        color={theme.jolocom.gray2}
        style={STYLES.addBtn}
        onClick={() => { onClick() }}>
        <ContentAddCircle style={STYLES.icon} color={theme.jolocom.gray2} />
      </IconButton>
      <div style={STYLES.infoHeader}>
        {value}
      </div>
      <Divider style={STYLES.divider} />
    </div>
  )
}

AddNew.propTypes = {
  value: React.PropTypes.any,
  onClick: React.PropTypes.func
}

export default Radium(AddNew)
