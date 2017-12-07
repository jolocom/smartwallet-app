import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import { theme } from 'styles'

const STYLES = {
  focusedBall: {
    backgroundColor: theme.palette.primary1Color
  },
  filledBall: {
    backgroundColor: theme.palette.textColor
  },
  inputBall: {
    color: theme.palette.alternateTextColor,
    margin: '0 3px',
    display: 'inline-block',
    width: '48px',
    height: '48px',
    verticalAlign: 'center',
    backgroundColor: theme.palette.disabledColor,
    position: 'relative',
    lineHeight: '48px',
    borderRadius: '24px',
    textAlign: 'center'
  },
  numberInput: {
    position: 'absolute',
    left: '-50000px'
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
  },
  clear: {
    display: 'inline-block',
    verticalAlign: 'center',
    position: 'absolute',
    height: '48px',
    width: '48px',
    cursor: 'pointer'
  }
}

const getCharAt = (str, pos) => (!str || pos >= str.length)
  ? (<span>&nbsp;</span>) : str.charAt(pos)

class SmsCodeInput extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    focused: PropTypes.bool.isRequired,
    pinLength: PropTypes.number.isRequired,
    onChange: PropTypes.func,
    onFocusChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value.length <= this.props.pinLength ? props.value : '',
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
    if (e.target.value.length <= this.props.pinLength) {
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
    const { pinLength = 6 } = this.props
    return (<div style={STYLES.container}>
      {'A'.repeat(pinLength).split('').map((element, index) => (
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
