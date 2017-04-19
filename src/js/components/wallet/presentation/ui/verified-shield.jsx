import React from 'react'
import Radium from 'radium'

const VerifiedShield = (props) => {
  const color = props.verified ? '#b3c90f' : '#9ba0aa'
  return <svg xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    style={Object.assign(props.style, {color: color, fill: 'currentColor'})}
    viewBox="0 0 24 24"
    onClick={props.verified ? () => {} : props.verify}
  >
    <path
      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45
      9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
    />
  </svg>
}

VerifiedShield.propTypes = {
  verified: React.PropTypes.bool.isRequired,
  style: React.PropTypes.object,
  verify: React.PropTypes.func
}
export default Radium(VerifiedShield)
