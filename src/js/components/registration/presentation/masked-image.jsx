import React from 'react'
// import Radium from 'radium'

class MaskedImage extends React.Component {
  static propTypes = {
    image: React.PropTypes.string.isRequired,
    uncovered: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(React.PropTypes.number)
    ).isRequired,
    uncovering: React.PropTypes.bool.isRequired,
    onPointUncovered: React.PropTypes.func.isRequired,
    onUncoveringChange: React.PropTypes.func.isRequired
  }

  // componentDidMount() {
  //   this.refs.input.focus()
  // }

  componentWillUnmount() {
    this.onRevealEnd()
  }

  onRevealStart() {
    this.props.onUncoveringChange(true)
  }

  onRevealEnd() {
    this.props.onUncoveringChange(false)
  }

  onReveal(e) {
    if (!this.props.uncovering) {
      return
    }

    if (e.touches && e.touches.length > 1) return
    const { pageX, pageY } = e.touches && e.touches[0] || e
    const { left, top } = e.target.getBoundingClientRect()

    this.props.onPointUncovered(pageX - left, pageY - top)
    // console.log('move', pageX, pageY)
  }

  render() {
    const props = this.props

    return (<svg
      onTouchStart={() => this.onRevealStart()}
      onMouseDown={() => this.onRevealStart()}
      onMouseMove={(e) => this.onReveal(e)}
      onTouchEnd={() => this.onRevealEnd()}
      onMouseUp={() => this.onRevealEnd()}
    >
      <defs>
        <clipPath id="mask">
          {props && props.uncovered.map(([x, y], idx) => <circle
            key={idx} r="5" cx={x} cy={y}
          />)}
        </clipPath>
      </defs>

      <image
        x="0" y="0" width="240" height="150"
        href={props.image}
        style={{clipPath: 'url(#mask)'}} />
    </svg>)
  }
}

export default MaskedImage
