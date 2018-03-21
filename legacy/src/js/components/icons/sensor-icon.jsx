import React from 'react'

export default (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}>
      <circle fill="#fff" cx="11" cy="12" r="3.06" />
      <path fill="#fff"
        d="M11 19.218v-1.75c3.015 0 5.468-2.453 5.468-5.468S14.015 6.532 11
        6.532v-1.75c3.98 0 7.218 3.238 7.218 7.218S14.98 19.218 11 19.218z" />
      <path fill="#fff"
        d="M11 23v-1.75c5.101 0 9.25-4.15 9.25-9.25S16.1 2.75 11 2.75V1c6.065 0
        11 4.934 11 11s-4.935 11-11 11z" />
    </svg>
  )
}
