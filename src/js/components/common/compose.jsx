import React from 'react'
import ReactDOM from 'react-dom'
import Radium from 'radium'

import {IconButton} from 'material-ui'

class Compose extends React.Component {
  static propTypes = {
    style: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    submitIcon: React.PropTypes.string,
    onKeyDown: React.PropTypes.func,
    onKeyUp: React.PropTypes.func,
    onSubmit: React.PropTypes.func
  }

  getInitialState() {
    return {
      content: ''
    }
  }

  onKeyDown(e) {
    if (this.props.onKeyDown) {
      return this.props.onKeyDown(e)
    }

    if (e.keyCode === 13) {
      if (e.shiftKey) {
        return true
      } else {
        setTimeout(() => {
          this.onSubmit()
        }, 5)
        return false
      }
    }
  }

  onKeyUp(e) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(e)
    }
    return false
  }

  onSubmit() {
    if (this.props.onSubmit(this.state.content)) {
      this.setState({content: ''})
      ReactDOM.findDOMNode(this.refs.textarea).value = ''
    }
  }

  onChange(e) {
    this.setState({
      content: e.target.value
    })
  }

  getStyles() {
    return {
      container: {
        borderTop: '1px solid #eee'
      },
      textareaWrapper: {
        display: 'flex'
      },
      textarea: {
        position: 'absolute',
        top: 0,
        left: 0,
        resize: 'none'
      },
      pre: {
        background: 'transparent',
        minHeight: '60px',
        maxHeight: '200px',
        width: '100%',
        height: '100%',
        padding: '16px 48px 16px 16px',
        margin: 0,
        fontSize: '15px',
        lineHeight: 1.3,
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        border: 0,
        display: 'block',
        outline: 'none'
      },
      span: {
        visibility: 'hidden'
      },
      button: {
        margin: '5px',
        right: '0px',
        position: 'fixed'
      }
    }
  }

  render() {
    let {style, placeholder, submitIcon} = this.props

    let styles = this.getStyles()

    submitIcon = submitIcon || 'send'

    const onChange = (...args) => this.onChange(...args)
    const onKeyDown = (...args) => this.onKeyDown(...args)
    const onSubmit = (...args) => this.onSubmit(...args)

    return (
      <div style={[styles.container, style]}>
        <div style={styles.textareaWrapper}>
          <pre style={styles.pre}>
            <span style={styles.span}>
              {this.state.content}
            </span><br />
          </pre>
          <textarea
            placeholder={placeholder}
            onChange={onChange}
            onKeyDown={onKeyDown}
            ref="textarea"
            style={[styles.textarea, styles.pre]} />
          <IconButton
            iconClassName="material-icons"
            secondary
            onTouchTap={onSubmit}
            style={styles.button}
          >
            {submitIcon}
          </IconButton>
        </div>
      </div>
    )
  }
}

export default Radium(Compose)
