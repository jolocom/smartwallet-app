import React from 'react'
import classNames from 'classnames'

import {linkToState} from 'lib/util'

import {IconButton} from 'react-mdl'

export default React.createClass({

  getInitialState() {
    return {
      content: ''
    }
  },

  onSubmit() {
    this.props.onSubmit(this.state.content)
  },

  render() {
    let {className, placeholder, submitIcon} = this.props

    let classes = classNames('jlc-compose', className)

    submitIcon = submitIcon || 'send'

    return (
      <div className={classes}>
        <div className="jlc-compose-textarea">
          <pre><span>{this.state.content}</span><br/></pre>
          <textarea placeholder={placeholder} onChange={linkToState(this, 'content')}></textarea>
          <IconButton name={submitIcon} className="jlc-compose-submit" colored={true} onClick={this.onSubmit}/>
        </div>
      </div>
    )
  }
})
