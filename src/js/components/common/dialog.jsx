import React from 'react'
import Radium from 'radium'
import { connect } from 'redux/utils'

@connect({
  props: (state, props) => ({
    actuallyVisible: state.getIn(['dialog', props.id, 'visible'])
  }),
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
    actuallyVisible: React.PropTypes.bool,
    children: React.PropTypes.node,
    style: React.PropTypes.object,
    fullscreen: React.PropTypes.bool,

    show: React.PropTypes.func,
    hide: React.PropTypes.func
  }

  componentDidMount() {
    if (this.props.visible) {
      this.props.show({id: this.props.id})
    } else {
      this.props.hide({id: this.props.id})
    }
  }

  componentWillUnmount() {
    this.props.hide({id: this.props.id})
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

    let {style, fullscreen, actuallyVisible} = this.props

    return (
      <div
        style={[
          styles.container,
          style,
          fullscreen && styles.fullscreen,
          actuallyVisible && styles.visible
        ]}>
        {this.props.children}
      </div>
    )
  }
}
