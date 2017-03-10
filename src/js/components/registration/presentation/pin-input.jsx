import React from 'react'
import Radium from 'radium'


const STYLES = {
  container: {
    position: 'relative',
    width: '200px',
    height: '40px',
    overflow: 'hidden'
  },
  inputBall: {
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'center',
    color: '#FFF',
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: '#000',
    lineHeight: '40px',
    textAlign: 'center'
  },
  numberInput: {
    position: 'absolute',
    left: '-50000px'
  }
}


function getCharAt(s, pos) {
  if (!s || pos >= s.length) {
    return <span>&nbsp;</span>
  }

  return s.charAt(pos)
}

class PinInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    this.refs.input.focus()
  }

  render() {
    const props = this.props

    return (<div style={STYLES.container}>
      {[0, 1, 2, 3].map((idx) => (
        <div key={idx} style={STYLES.inputBall}
          onClick={() => this.refs.input.focus()}
        >
          {getCharAt(props.value, idx)}
        </div>
      ))}

      <div>
        <input style={STYLES.numberInput}
          type="number"
          ref="input"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    </div>)
  }
}

export default Radium(PinInput)
