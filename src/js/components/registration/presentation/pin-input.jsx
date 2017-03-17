import React from 'react'
import Radium from 'radium'
import Theme from '../../../styles/jolocom-theme'

const STYLES = {
  container: {
    position: 'relative',
    width: '140px',
    height: '24px',
    textAlign: 'center',
    padding: '0 20px',
    overflow: 'hidden'
  },
  inputBall: {
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'center',
    color: Theme.palette.alternateTextColor,
    margin: '0 3px',
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: Theme.palette.disabledColor,
    lineHeight: '24px',
    textAlign: 'center'
  },
  focusedBall: {
    backgroundColor: Theme.palette.primary1Color
  },
  filledBall: {
    backgroundColor: Theme.palette.textColor
  },
  numberInput: {
    position: 'absolute',
    left: '-50000px'
  },
  clear: {
    display: 'block',
    boxSizing: 'border-box',
    position: 'absolute',
    right: '10px',
    top: (24 / 2 - 14 / 2) + 'px',
    color: Theme.palette.alternateTextColor,
    backgroundColor: Theme.palette.textColor,
    fontFamily: 'monospace',
    lineHeight: '14px',
    textAlign: 'center',
    borderRadius: '7px',
    width: '14px',
    height: '14px',
    paddingLeft: '1px',
    marginLeft: '3px',
    cursor: 'pointer'
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
    focused: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onFocusChange: React.PropTypes.func.isRequired
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
          props.value.charAt(idx) !== '' && STYLES.filledBall,
          idx === props.value.length &&
            props.focused &&
            STYLES.focusedBall
        ]}
          onClick={() => this.refs.input.focus()}
        >
          {getCharAt(props.value, idx)}
        </div>
      ))}
      {!props.disabled && (props.value.length || null) &&
        <div onClick={() => this.clearAndFocus()}
          style={STYLES.clear}
        >
        x
        </div>
      }

      <div>
        <input style={STYLES.numberInput}
          type="number"
          ref="input"
          value={props.value}
          onKeyDown={(e) => this.handleKeyDown(e)}
          onChange={(e) => this.handleChange(e)}
          onFocus={() => props.onFocusChange(true)}
          onBlur={() => props.onFocusChange(false)}
        />
      </div>
    </div>)
  }
}

export default Radium(PinInput)
