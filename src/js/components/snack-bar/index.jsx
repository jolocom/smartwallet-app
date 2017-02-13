import React from 'react'
import { connect } from 'redux/utils'

import { Snackbar } from 'material-ui'

export default connect({
  props: ['snackBar']
})((props) => {
  const {snackBar} = props

  return <Snackbar
    open={snackBar.open} message={snackBar.message}
    action={snackBar.undo && 'undo'}
    onActionTouchTap={snackBar.undoCallback}
  />
})
