import React from 'react'
import Radium from 'radium'
import { theme } from 'styles'

const STYLES = {
  inputBall: {
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'center',
    color: theme.palette.alternateTextColor,
    margin: '0 3px',
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    backgroundColor: theme.palette.disabledColor,
    lineHeight: '48px',
    textAlign: 'center'
  },
  focusedBall: {
    backgroundColor: theme.palette.primary1Color
  },
  filledBall: {
    backgroundColor: theme.palette.textColor
  },
  numberInput: {
    position: 'absolute',
    left: '-50000px'
  },
  clear: {
    display: 'inline-block',
    verticalAlign: 'center',
    position: 'absolute',
    height: '48px',
    width: '48px',
    cursor: 'pointer'
  },
  img: {
    userSelect: 'none',
    marginTop: '14px',
    marginLeft: '8px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    width: '24px',
    height: '24px'
  }
}

function getCharAt(s, pos) {
  if (!s || pos >= s.length) {
    return (<span>&nbsp;</span>)
  }

  return s.charAt(pos)
}

class SmsCodeInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool,
    focused: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func,
    onFocusChange: React.PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value.length < 7 ? props.value : '',
      focused: false
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.clearAndFocus = this.clearAndFocus.bind(this)
  }
  componentDidMount() {
    this.refs.input.focus()
  }

  handleKeyDown(e) {
    if (e.which === 8) {
      e.preventDefault()
    }
  }

  handleChange(e) {
    if (e.target.value.length < 7) {
      this.props.onChange(e.target.value)
      this.setState({value: e.target.value})
    }
  }

  clearAndFocus() {
    this.props.onChange('')
    this.props.onFocusChange(true)
    this.setState({
      value: '',
      focused: true
    })
    this.refs.input.focus()
  }

  handleFocus(focused) {
    this.props.onFocusChange(focused)
    this.setState({focused})
  }
  componentWillUpdate({focused}) {
    if (focused) {
      this.refs.input.focus()
    }
  }

  render() {
    const { value, focused } = this.state

    return (<div style={STYLES.container}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div key={index} style={[
          STYLES.inputBall,
          value.charAt(index) !== '' && STYLES.filledBall,
          index === value.length && focused && STYLES.focusedBall
        ]}
          onClick={() => this.refs.input.focus()}
        >
          {getCharAt(value, index)}
        </div>
      ))}
      <div style={STYLES.clear}>
      {(value.length > 0) && <div onClick={this.clearAndFocus}
        style={{
          ...STYLES.img,
          backgroundImage: 'url(/img/ic_cancel_brown_24px.svg)'
        }} />
      }
      </div>

      <div>
        <input style={STYLES.numberInput}
          type="number"
          ref="input"
          value={value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          onFocus={() => { this.handleFocus(true) }}
          onBlur={() => { this.handleFocus(false) }}
        />
      </div>
    </div>)
  }
}

export default Radium(SmsCodeInput)
