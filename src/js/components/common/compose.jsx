import React from 'react'
import classNames from 'classnames'

import {IconButton} from 'react-mdl'

export default React.createClass({

  mixins: [React.addons.LinkedStateMixin],

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
          <textarea placeholder={placeholder} valueLink={this.linkState('content')}></textarea>
          <IconButton name={submitIcon} className="jlc-compose-submit" colored={true} onClick={this.onSubmit}/>
        </div>
      </div>
    )
  }
})
