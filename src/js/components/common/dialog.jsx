import React from 'react'
import Radium from 'radium'
import { connect } from 'redux/utils'

@connect({
  actions: [
    'common/dialog:show',
    'common/dialog:hide'
  ]
})
@Radium
export default class Dialog extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    visible: React.PropTypes.bool,
    children: React.PropTypes.node,
    style: React.PropTypes.object,
    fullscreen: React.PropTypes.bool,

    show: React.PropTypes.func,
    hide: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    if (props.visible) {
      props.show(props.id)
    } else {
      props.hide(props.id)
    }
  }

  getStyles() {
    return {
      container: {
      },
      fullscreen: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 1400,
        opacity: 0,
        transform: 'translate(0, 100%)',
        transition: 'opacity .3s, transform .3s'
      },
      visible: {
        opacity: 1,
        transform: 'translate(0, 0)'
      }
    }
  }

  render() {
    let styles = this.getStyles()

    let {style, fullscreen, visible} = this.props

    return (
      <div
        style={[
          styles.container,
          style,
          fullscreen && styles.fullscreen,
          visible && styles.visible
        ]}>
        {this.props.children}
      </div>
    )
  }
}
