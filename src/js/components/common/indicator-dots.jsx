import React from 'react'

function IndicatorDots (props, context) {
  const dots = []
  let {muiTheme} = context
  for (let i = 0; i < props.total; i++) {
    const dotStyle = {
      display: 'inline-block',
      height: '8px',
      width: '8px',
      border: `1px solid ${muiTheme.jolocom.gray2}`,
      borderRadius: '4px',
      backgroundColor: 'transparent',
      margin: '7px 5px',
      transitionDuration: '300ms'
    }
    dotStyle.backgroundColor = props.index === i ? muiTheme.jolocom.gray2 : 'transparent'
    dots.push(<span key={i} style={dotStyle}></span>)
  }
  return <div style={styles.wrapper}>{dots}</div>
}

IndicatorDots.contextTypes = {
  muiTheme: React.PropTypes.object
}

IndicatorDots.propTypes = {
  index: React.PropTypes.number.isRequired,
  total: React.PropTypes.number.isRequired
}

const styles = {
  wrapper: {
    position: 'absolute',
    width: '100%',
    zIndex: '100',
    bottom: '0px',
    textAlign: 'center'
  }
}

export default IndicatorDots
