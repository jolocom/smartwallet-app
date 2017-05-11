import React from 'react'

class MaskedImage extends React.Component {
  static propTypes = {
    image: React.PropTypes.string.isRequired,
    style: React.PropTypes.object.isRequired,
    maskColor: React.PropTypes.string.isRequired,
    // Type checking too slow for paths
    uncoveredPaths: React.PropTypes.any.isRequired,
    uncovering: React.PropTypes.bool.isRequired,
    onPointUncovered: React.PropTypes.func.isRequired,
    onUncoveringChange: React.PropTypes.func.isRequired
  }

  componentWillUnmount() {
    this.onRevealEnd()
  }

  onRevealStart = (e) => {
    e.preventDefault()
    this.props.onUncoveringChange(true)
  }

  onRevealEnd = () => {
    this.props.onUncoveringChange(false)
  }

  onReveal = (e) => {
    if (!this.props.uncovering) {
      return
    }

    if (e.touches && e.touches.length > 1) return
    const { pageX, pageY } = e.touches && e.touches[0] || e
    const { left, top } = e.target.getBoundingClientRect()

    this.props.onPointUncovered(pageX - left, pageY - top)
  }

  render() {
    const props = this.props

    return (<svg
      style={this.props.style}
      onTouchStart={this.onRevealStart}
      onTouchMove={this.onReveal}
      onTouchEnd={this.onRevealEnd}
      onMouseDown={this.onRevealStart}
      onMouseMove={this.onReveal}
      onMouseUp={this.onRevealEnd}
    >
      <defs>
        <mask id="entropy-mask">
          <rect height="100%" width="100%" fill="#fff" />
          {props && props.uncoveredPaths.map((path, pathIdx) =>
            <polyline key={pathIdx} points={
              path.map(point => `${point[0]},${point[1]}`).join(' ')
            } style={{
              strokeWidth: '20px', stroke: '#000',
              strokeLinecap: 'round', strokeLinejoin: 'round',
              fill: 'rgba(0, 0, 0, 0)',
              textAlign: 'center'
            }} />
          )}
        </mask>
      </defs>

      <rect height="100%" width="100%" mask="url(#entropy-mask)"
        fill={props.maskColor} />
      }
    </svg>)
  }
}

export default MaskedImage
