import React from 'react'
import Radium from 'radium'
import theme from '../../../styles/jolocom-theme'

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
    backgroundColor: theme.palette.accent1Color,
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
    onFocusChange: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.clearAndFocus = this.clearAndFocus.bind(this)
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

  componentWillUpdate(props) {
    if (props.focused) {
      this.refs.input.focus()
    }
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
      <div style={{...STYLES.clear}}>
      {(props.value.length > 0) && (!props.confirm) &&
        <div onClick={this.clearAndFocus}
          style={{...STYLES.img, ...{
            backgroundImage: 'url(/img/ic_cancel_brown_24px.svg)'
          }}}
        />
      }
      </div>

      <div>
        <input style={STYLES.numberInput}
          type="number"
          ref="input"
          value={props.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          onFocus={() => props.onFocusChange(true)}
          onBlur={() => props.onFocusChange(false)}
        />
      </div>
    </div>)
  }
}

export default Radium(PinInput)
