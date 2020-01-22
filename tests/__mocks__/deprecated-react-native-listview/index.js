export default {
  statics: {
    DataSource: require('ListView').DataSource,
  },
  render() {
    return require('react').createElement(
      'ListView',
      this.props,
      this.props.children,
    )
  },
}
