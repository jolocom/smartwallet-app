import React from 'react'
import MDLComponent from './MDLComponent.jsx'

export default Component => {
  const render = Component.prototype.render

  Component.prototype.render = function() {
    return <MDLComponent>{render()}</MDLComponent>
  }

  return Component
}
