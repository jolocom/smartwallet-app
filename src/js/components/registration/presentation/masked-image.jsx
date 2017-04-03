import React from 'react'
import theme from '../../../styles/jolocom-theme'
// import Radium from 'radium'

class MaskedImage extends React.Component {
  static propTypes = {
    image: React.PropTypes.string.isRequired,
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

    return (<svg style={{width: '240px', height: '150px', margin: 'auto'}}
      onTouchStart={this.onRevealStart}
      onMouseDown={this.onRevealStart}
      onClick={this.onRevealStart}
      onMouseMove={this.onReveal}
      onTouchEnd={this.onRevealEnd}
      onMouseUp={this.onRevealEnd}
    >
      <defs>
        <mask id="mask">
          {props && props.uncoveredPaths.map((path, pathIdx) =>
            <polyline key={pathIdx} points={
              path.map(point => `${point[0]},${point[1]}`).join(' ')
            } style={{
              strokeWidth: '20px', stroke: '#F00',
              strokeLinecap: 'round', strokeLinejoin: 'round',
              fill: 'rgba(0, 0, 0, 0)',
              textAlign: 'center'
            }} />
          )}

        </mask>
      </defs>
      <foreignObject width="240" height="150" textAnchor="middle">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{textAlign: 'center',
          color: theme.jolocom.gray1}}>
          <p>{props.uncoveredPaths.length > 0 ? '' : props.message1}</p>
          <br />
          <p>{props.uncoveredPaths.length > 0 ? '' : props.message2}</p>
          <br />
          <p>{props.uncoveredPaths.length > 0 ? '' : props.message3}</p>
        </div>
      </foreignObject>

      <image
        x="0" y="0" width="240" height="150"
        href={props.image}
        mask="url(#mask)"
      />
    </svg>)
  }
}

export default MaskedImage
