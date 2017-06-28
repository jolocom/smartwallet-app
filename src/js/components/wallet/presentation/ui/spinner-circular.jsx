import React from 'react'
import CircularProgress from 'material-ui/CircularProgress'

const SpinnerCircular = () => {
  return (
    <div>
      <CircularProgress size={150} thickness={8}
        style={{backgroundImage: 'url(/img/img_techguy.svg)'}} />
    </div>
  )
}

export default SpinnerCircular
