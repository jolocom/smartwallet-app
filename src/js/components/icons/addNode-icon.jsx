import React from 'react'

export default (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 40 40"
      {...props}>
      <ellipse
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeMiterlimit="10"
        transform="rotate(-45.001 12 12)"
        cx="12"
        cy="12"
        rx="6.01"
        ry="6.01" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeMiterlimit="10"
        d="M6.086 17.914L2.85 21.15M21.15 2.85l-3.236 3.236" />
    </svg>
  )
}
