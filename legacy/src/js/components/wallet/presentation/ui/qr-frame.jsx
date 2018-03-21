import React from 'react'

export default class QRFrame extends React.Component {
  render() {
    return (
      <div>
        <svg width="100%" height="400px">
          <rect x="25%" y="35%" width="50%" height="40%"
            style={{fill: 'none', stroke: '#942f51', strokeWidth: '8'}} />
        </svg>
      </div>
    )
  }
}
