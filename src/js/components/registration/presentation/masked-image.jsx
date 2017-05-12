import React from 'react'
import theme from '../../../styles/jolocom-theme'

class MaskedImage extends React.Component {
  static propTypes = {
    image: React.PropTypes.string.isRequired,
    style: React.PropTypes.object.isRequired,
    // Type checking too slow for paths
    uncoveredPaths: React.PropTypes.any.isRequired,
    uncovering: React.PropTypes.bool.isRequired,
    onPointUncovered: React.PropTypes.func.isRequired,
    onUncoveringChange: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.onRevealStart = this.onRevealStart.bind(this)
    this.onReveal = this.onReveal.bind(this)
    this.onRevealEnd = this.onRevealEnd.bind(this)
  }

  // componentDidMount() {
  //   this.refs.input.focus()
  // }

  componentWillUnmount() {
    this.onRevealEnd()
  }

  onRevealStart(e) {
    console.log('start')
    e.preventDefault()
    this.props.onUncoveringChange(true)
  }

  onRevealEnd() {
    console.log('end')
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
    // console.log(props.uncoveredPaths.length)

    return (<svg
      style={this.props.style}
      onTouchStart={(e) => this.onRevealStart(e)}
      onTouchMove={(e) => this.onReveal(e)}
      onTouchEnd={() => this.onRevealEnd()}
      onMouseDown={(e) => this.onRevealStart(e)}
      onMouseMove={(e) => this.onReveal(e)}
      onMouseUp={() => this.onRevealEnd()}
    >
      <defs>
        <mask id="mask">
          {props && props.uncoveredPaths.map((path, pathIdx) =>
            <polyline key={pathIdx} points={
              path.map(point => `${point[0]},${point[1]}`).join(' ')
            } style={{
              strokeWidth: '20px', stroke: '#FFF',
              strokeLinecap: 'round', strokeLinejoin: 'round',
              fill: 'rgba(0, 0, 0, 0)',
              textAlign: 'center'
            }} />
          )}

        </mask>
      </defs>

      <image
        x="0" y="0" width="700" height="639"
        href={props.image}
        mask="url(#mask)"
        draggable={false}
      />

      {props.uncoveredPaths.length === 0 && <g>
        <text x="350" y="150" fontSize="21" dy="0"
          fontWeight="lighter" textAnchor="middle" fill={theme.jolocom.gray1}
        >
          <tspan x="350" dy="0.6em">{props.message1}</tspan>
          <tspan x="350" dy="1.6em">{props.message2}</tspan>
          <tspan x="350" dy="1.2em">{props.message3}</tspan>
          <tspan x="350" dy="1.6em">{props.message4}</tspan>
          <tspan x="350" dy="1.2em">{props.message5}</tspan>
          <tspan x="350" dy="1.2em">{props.message6}</tspan>
        </text>
      </g>}
    </svg>)
  }
}

export default MaskedImage
