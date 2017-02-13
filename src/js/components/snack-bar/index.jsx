import React from 'react'
import { connect } from 'redux/utils'

import { Snackbar } from 'material-ui'

export default connect({
  props: ['snackbar']
})((props) => {
  const {snackbar} = props

  return <Snackbar
    open={snackbar.open} message={snackbar.message}
    action={snackbar.undo && 'undo'}
    onActionTouchTap={snackbar.undoCallback}
  />
})
