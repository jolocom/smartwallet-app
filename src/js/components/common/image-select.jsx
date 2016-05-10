import React from 'react'
import Radium from 'radium'
import accepts from 'attr-accept'

import {IconButton} from 'material-ui'

let ImageSelect = React.createClass({

  open() {
    this.fileInputEl.value = null
    this.fileInputEl.click()
  },

  render: function() {
    return (
      <div>
        <input
          ref={el => this.fileInputEl = el}
          type="file"
          name="file"
          style={styles.file}
          multiple={false}
          onChange={this._handleSelectFile} />
        <IconButton iconClassName="material-icons" onTouchTap={() => this.open()}>photo_camera</IconButton>
      </div>
    )
  },

  _handleSelectFile({target}) {
    let file = target.files[0]

    if (!accepts(file, 'image/*')) {
      this.props.onError('Invalid file type')
    } else {
      this.props.onChange(file)
    }
  }
})

let styles = {
  file: {
    display: 'none'
  }
}

export default Radium(ImageSelect)
