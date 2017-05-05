import React from 'react'
import Radium from 'radium'
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle'
import {theme} from 'styles'

import {
  FlatButton,
  Divider
} from 'material-ui'

const STYLES = {
  divider: {
    marginLeft: '16px'
  },
  addBtn: {
    margin: '10px',
    textAlign: 'left',
    width: '100%',
    color: theme.jolocom.gray2

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
  },
  list: {
    paddingLeft: '50px'
  }
}
const AddNew = ({value, onClick}) => {
  return (
    <div style={STYLES.list} >
      <FlatButton
        color={STYLES.addBtn.color}
        style={STYLES.addBtn}
        onClick={() => { onClick() }}
        label={value}
        icon={
          <ContentAddCircle
            style={STYLES.icon}
            color={STYLES.addBtn.color}
          />
        }
      />
      <Divider style={STYLES.divider} />
    </div>
  )
}

AddNew.propTypes = {
  value: React.PropTypes.any,
  onClick: React.PropTypes.func.isRequired
}

export default Radium(AddNew)
