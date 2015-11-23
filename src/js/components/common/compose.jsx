import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import {IconButton} from 'material-ui'

export default React.createClass({

  getInitialState() {
    return {
      content: ''
    }
  },

  onSubmit() {
    if (this.props.onSubmit(this.state.content)) {
      this.setState({content: ''})
      ReactDOM.findDOMNode(this.refs.textarea).value = ''
    }
  },

  onChange(e) {
    this.setState({
      content: e.target.value
    })
  },

  getStyles() {
    return {
      button: {
        margin: '5px'
      }
    }
  },

  render() {
    let {className, placeholder, submitIcon} = this.props

    // @TODO move to inline styles
    let classes = classNames('jlc-compose', className)

    let styles = this.getStyles()

    submitIcon = submitIcon || 'send'

    return (
      <div className={classes}>
        <div className="jlc-compose-textarea">
          <pre><span>{this.state.content}</span><br/></pre>
          <textarea placeholder={placeholder} onChange={this.onChange} ref="textarea"></textarea>
          <IconButton iconClassName="material-icons" secondary={true} onTouchTap={this.onSubmit} style={styles.button}>{submitIcon}</IconButton>
        </div>
      </div>
    )
  }
})
