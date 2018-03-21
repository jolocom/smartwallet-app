import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

const IconEther = (props) => {
  return (
    <svg x="0px" y="0px" viewBox="0 0 24 24"
      style={{height: '42px', width: '42px', position: 'absolute'}}>
      <path style={{fill: props.color}}
        d="M12 13.975l-4.826-2.704L12 2.489l4.823 8.782z" />
      <path style={{fill: props.color}}
        d="M12 21.51l-4.949-9.005L12 15.332l4.949-2.827z" />
    </svg>
  )
}
IconEther.propTypes = {
  color: PropTypes.string
}
export default Radium(IconEther)
