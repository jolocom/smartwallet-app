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
  focusedBall: {
    backgroundColor: '#5F5'
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
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    this.refs.input.focus()
  }

  componentWillReceiveProps(props) {
    if (props.disabled) {
      this.refs.input.blur()
    }
  }

  handleKeyDown(e) {
    if (e.which === 8) {
      e.preventDefault()
    }
  }

  handleChange(e) {
    this.props.onChange(e.target.value)
  }

  clearAndFocus() {
    this.props.onChange('')
    this.refs.input.focus()
  }

  render() {
    const props = this.props

    return (<div style={STYLES.container}>
      {[0, 1, 2, 3].map((idx) => (
        <div key={idx} style={[
          STYLES.inputBall,
          idx === props.value.length && STYLES.focusedBall
        ]}
          onClick={() => this.refs.input.focus()}
        >
          {getCharAt(props.value, idx)}
        </div>
      ))}
      {!props.disabled && <div onClick={() => this.clearAndFocus()}
        style={{display: 'inline-block'}}>
        BOOM!
      </div>}

      <div>
        <input style={STYLES.numberInput}
          type="number"
          ref="input"
          value={props.value}
          onKeyDown={(e) => this.handleKeyDown(e)}
          onChange={(e) => this.handleChange(e)}
        />
      </div>
    </div>)
  }
}

export default Radium(PinInput)
