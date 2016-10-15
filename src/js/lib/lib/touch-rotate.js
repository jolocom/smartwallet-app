/**
 * TouchRotate
 * @param DOMElement touchElement The element whose center we use for the rotation, and on which the touch events occur; musn't be an svg element
 * @param function callbacks {move: function, end (optional): function}
 */
var TouchRotate = function (touchElement, callbacks) {

  // Does not work with SVG, hence touchElement mustn't be an SVG
  function getElementCenterCoordinates(el) {
    return {
      centerX: el.offsetLeft + el.offsetWidth / 2,
      centerY: el.offsetTop + el.offsetHeight / 2
    }
  }

  // Get radian starting from standard CSS transform axis (vertical top axis: ((0,0),(0,1)))
  function getRadian(currentX, currentY, centerX, centerY) {
    var opp = centerY - currentY
    var adj = currentX - centerX
    var rad_starting_right = Math.atan2(opp, adj)
    return Math.PI / 2 - rad_starting_right
  }

  // Handle mobile and desktop mouse events for rotation
  ['touchstart', 'mousedown', 'touchmove', 'mousedownmove'].forEach(function (eventName) {
    touchElement.addEventListener(eventName, function (e) {
      var currentX = e.touches ? e.touches[0].pageX : (e.pageX ? e.pageX : e.detail.pageX)
      var currentY = e.touches ? e.touches[0].pageY : (e.pageY ? e.pageY : e.detail.pageY)
      var {centerX, centerY} = getElementCenterCoordinates(touchElement)
      var currentRadian = getRadian(currentX, currentY, centerX, centerY)
      callbacks['move'](currentRadian)
      e.preventDefault()
    })
  }); // do not remove the semi-colon

  ['touchend', 'mouseup'].forEach(function (eventName) {
    document.addEventListener(eventName, function () {
      if (typeof callbacks.end !== 'undefined') {
        callbacks['end']()
      }
    })
  })

  // Create custom "mousedownmove" event
  var mousedown = false
  touchElement.addEventListener('mousedown', () => {
    mousedown = true
  })
  document.addEventListener('mouseup', () => {
    mousedown = false
  })
  touchElement.addEventListener('mousemove', (e) => {
    if (mousedown) {
      var triggerEvent = function(el, eventName, options) {
        var event
        if (window.CustomEvent) {
          event = new CustomEvent(eventName, options)
        } else {
          event = document.createEvent('CustomEvent')
          event.initCustomEvent(eventName, true, true, options)
        }
        el.dispatchEvent(event)
      }
      triggerEvent(touchElement, 'mousedownmove', {
        detail: {
          pageX: e.pageX,
          pageY: e.pageY
        }
      })
    }
  })
}

export default TouchRotate
