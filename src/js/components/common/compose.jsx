import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import {IconButton} from 'react-mdl'

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

  render() {
    let {className, placeholder, submitIcon} = this.props

    let classes = classNames('jlc-compose', className)

    submitIcon = submitIcon || 'send'

    return (
      <div className={classes}>
        <div className="jlc-compose-textarea">
          <pre><span>{this.state.content}</span><br/></pre>
          <textarea placeholder={placeholder} onChange={this.onChange} ref="textarea"></textarea>
          <IconButton name={submitIcon} className="jlc-compose-submit" colored={true} onClick={this.onSubmit}/>
        </div>
      </div>
    )
  }
})
