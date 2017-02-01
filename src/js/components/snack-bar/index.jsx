import React from 'react'
import Reflux from 'reflux'

import SnackbarStore from 'stores/snackbar'

const SnackBarContainer = React.createClass({
  mixins: [
    Reflux.connect(SnackbarStore, 'snackbar'),
  ],

  render() {
    return <Snackbar
        open={this.state.snackbar.open}
        message={this.state.snackbar.message}
        action={this.state.snackbar.undo && 'undo'}
        onActionTouchTap={this.state.snackbar.undoCallback}
    />
  }
})

export SnackBarContainer
