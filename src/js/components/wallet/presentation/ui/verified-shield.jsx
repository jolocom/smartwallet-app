import React from 'react'
import Radium from 'radium'

const VerifiedShield = (props) => {
  if (props.verified) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        style={Object.assign(props.style,
          {color: '#b3c90f', fill: 'currentColor'})}
        viewBox="0 0 24 24"
        onClick={() => {}}>
        <path
          d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45
          9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
        />
      </svg>
    )
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        style={Object.assign(props.style,
          {
            color: props.savedToBlockchain ? '#fda72c' : '#9ba0aa',
            fill: 'currentColor'
          })}
        viewBox="0 0 24 24"
        onClick={props.verify}>
        <path
          d="M20.708 2.866c-1.788-.265-3.553-.625-5.242-1.305A31.83 31.83 0 0 1
          12.13 0h-.26c-.256.177-.54.299-.816.436-1.428.71-2.885 1.344-4.42
          1.772-1.067.297-2.157.471-3.245.654-.336.057-.673.11-1.008.169-.08.014
          -.155.045-.233.069v1.366c.05.296.036.597.051.895.059
          1.203.118 2.406.199 3.608.082 1.237.369 2.43.673 3.621.681 2.665 1.947
          5.02 3.632 7.146.738.93 1.625 1.704 2.513 2.479a12.742 12.742 0 0 0
          2.424 1.659c.086.045.175.084.262.126h.163c.011-.011.02-.027.034-.033
          1.239-.538 2.262-1.396 3.278-2.277 1.685-1.46 2.974-3.233
          4.037-5.193.765-1.41 1.27-2.922
          1.665-4.48.386-1.525.557-3.074.62-4.642.042-1.015.107-2.03.13-3.045
          .002-.066.015-.131.023-.197V3.1a8.238 8.238
          0 0 0-1.144-.234zm-4.377 12.248a.763.763 0 1 1-1.08 1.08L12
          12.944l-3.251 3.25a.76.76 0 0 1-1.08 0 .764.764 0 0 1
          0-1.08l3.251-3.25-3.251-3.252a.764.764 0 1 1 1.08-1.08L12
          10.783l3.251-3.25a.763.763 0 1 1 1.08 1.08l-3.25 3.25 3.25 3.251z" />
      </svg>
    )
  }
}

VerifiedShield.propTypes = {
  verified: React.PropTypes.bool.isRequired,
  savedToBlockchain: React.PropTypes.bool.isRequired,
  style: React.PropTypes.object,
  verify: React.PropTypes.func
}
export default Radium(VerifiedShield)
