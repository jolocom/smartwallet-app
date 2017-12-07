import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

const IconCheckmark = (props) => {
  return (
    <svg x="0px" y="0px" viewBox="0 0 47 47"
      style={{height: '18px', width: '18px', margin: '2px'}}>
      <path style={{fill: props.color}}
        d="M23.4,0C10.5,0,0,10.5,0,23.4s10.5,23.4,23.4,23.4s23.4-10.5,
        23.4-23.4S36.2,0,23.4,0z M38.8,17.4l-18.1,16
        L7.3,19.9c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,
        0l11.6,11.6l16-14.2c0.6-0.5,1.5-0.5,2.1,0.1C39.5,
        15.9,39.4,16.9,38.8,17.4z" />
    </svg>
  )
}
IconCheckmark.propTypes = {
  color: PropTypes.string
}
export default Radium(IconCheckmark)
