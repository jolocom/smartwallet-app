// THIS FILE TAKES CARE OF DRAWING THE D3 GRAPH
// It is passed a state from the graph.jsx file, and then it draws
// the graph according to that state. The element itself is stateless.
// Currently I have issues with doing persistent changes here, for instance
// a moved node will not save upon refresh.
import d3 from 'd3'
import STYLES from 'styles/app'
import {
  EventEmitter
}
from 'events'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import JolocomTheme from 'styles/jolocom-theme'

const theme = getMuiTheme(JolocomTheme)

/**
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
    console.log('up')
    touchElement.addEventListener(eventName, function () {
      if (typeof callbacks.end !== 'undefined')
        callbacks['end']()
    })
  })

  // Create custom "mousedownmove" event
  var mousedown = false
  touchElement.addEventListener('mousedown', () => {
    console.log('mousedown')
    mousedown = true
  })
  touchElement.addEventListener('mouseup', () => {
    console.log('mouseup')
    mousedown = false
  })
  touchElement.addEventListener('mousemove', (e) => {
    if (mousedown) {
      console.log('mousemove mousedown')
      function triggerEvent(el, eventName, options) {
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

export default class GraphD3 extends EventEmitter {

  constructor(el) {
    super()
    this.MAX_VISIBLE_NUMBER_OF_NODES = 8
    this.graphContainer = el // @todo use for touchrotate (graph-container)
    this.rendered = false

    // A bit of code duplication here.
    this.width = this.graphContainer.offsetWidth || STYLES.width
    this.height = this.graphContainer.offsetHeight || STYLES.height

    this.svg = d3.select(this.graphContainer).append('svg:svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('svg:g')
  }

  render = function (nodes) {
    if (this.rendered) {
      this.eraseGraph()
    }

    this.calcDimensions()
    this.orderNodes(nodes)
    this.setUpForce(nodes)
    this.drawBackground()
    this.rendered = true

    var thisInstance = this

    var TouchRotateCallbacks = function () {
      var lastNotchRadian = false

      return {
        move: function (touchMoveRadian) { // closure isn't functional #todo

          // Quick fix because touchMoveRadian abruptly switches from (+3/2 * PI) to (-1/2 * PI)
          var radianDiff = touchMoveRadian - lastNotchRadian
          if (radianDiff < -Math.PI)
            radianDiff = touchMoveRadian + Math.PI * 2 - lastNotchRadian
          else if (radianDiff > Math.PI)
            radianDiff = lastNotchRadian - (touchMoveRadian + Math.PI * 2)

          if (lastNotchRadian === false)
            lastNotchRadian = touchMoveRadian
          else if (radianDiff < -Math.PI / thisInstance.MAX_VISIBLE_NUMBER_OF_NODES) // @todo constant / not stateless
          {
            lastNotchRadian = touchMoveRadian
            if (thisInstance.index < thisInstance.numberOfAdjcent - thisInstance.MAX_VISIBLE_NUMBER_OF_NODES) {
              thisInstance.index++
              thisInstance.force.stop() // @TODO DRY
              thisInstance.sortNodes()
              thisInstance.force.nodes(thisInstance.currentDataNodes)
              thisInstance.force.links(thisInstance.currentDataLinks)
              thisInstance.drawNodes()
              thisInstance.force.start()
            }
          } else if (radianDiff > Math.PI / thisInstance.MAX_VISIBLE_NUMBER_OF_NODES) // @todo constant / not stateless
          {
            lastNotchRadian = touchMoveRadian
            if (thisInstance.index > 0) {
              thisInstance.index--
              thisInstance.force.stop() // @TODO DRY
              thisInstance.sortNodes()
              thisInstance.force.nodes(thisInstance.currentDataNodes)
              thisInstance.force.links(thisInstance.currentDataLinks)
              thisInstance.drawNodes()
              thisInstance.force.start()
            }
          }
        },
        end: function () {
          lastNotchRadian = false
        }
      }
    }

    var touchRotateCallbacks = TouchRotateCallbacks()
    new TouchRotate(this.graphContainer, touchRotateCallbacks)

  }

  calcDimensions = function () {
    this.width = this.graphContainer.offsetWidth || STYLES.width
    this.height = this.graphContainer.offsetHeight || STYLES.height

    this.smallNodeSize = STYLES.smallNodeSize
    this.largeNodeSize = STYLES.largeNodeSize
  }

  orderNodes= function (nodes) {
    console.table(nodes.neighbours, ['name', 'title'])

    nodes.neighbours.sort(function(a,b) {
      if ((a.name || a.title || 'zzzzzz').toLowerCase() > (b.name || b.title || 'zzzzzz').toLowerCase())
        return 1
      else if ((a.name || a.title || 'zzzzzz').toLowerCase() < (b.name || b.title || 'zzzzzz').toLowerCase())
        return -1
      else
        return 0
    })

    console.table(nodes.neighbours, ['name', 'title'])
  }

  // Starts the force simulation.
  setUpForce = function (nodes) {
    // Upon set up force we also initialize the dataLinks and dataNodes
    // variables.
    this.dataNodes = [nodes.center]
    this.currentDataNodes = [nodes.center]
    this.dataLinks = []
    this.currentDataLinks = []
    this.index = 0
    this.numberOfAdjcent = 0
  // Flatten the center and neighbour nodes we get from the state

    for (let i = 0; i < nodes.neighbours.length; i++) {
      this.dataNodes.push(nodes.neighbours[i])
      this.dataLinks.push({
        'source': i + 1,
        'target': 0
      })
      this.numberOfAdjcent++
    }

    //find center to arrange nodes

    this.center = {
      y: (this.height / 2),
      x: this.width / 2
    }

    if (this.MAX_VISIBLE_NUMBER_OF_NODES < this.numberOfAdjcent) {
      this.nodePositions = []

      let angle = (2 * Math.PI) / 8, num = 0

      for (let i = 0; i < this.numberOfAdjcent; i++) {
        let pos = {
          x: Math.sin(angle * (num + 3.5)) * STYLES.largeNodeSize * 1.4 + this.center.x,
          y: Math.cos(angle * (num + 3.5)) * STYLES.largeNodeSize * 1.4 + this.center.y
        }
        this.nodePositions.push(pos)
        num --

      }

    }
    this.sortNodes()

    // now the nodes are there, we can initialize
    // Then we initialize the simulation, the force itself.
    this.force = d3.layout.force()
      .nodes(this.currentDataNodes)
      .links(this.currentDataLinks)
      .charge(-100)
      .chargeDistance(STYLES.largeNodeSize * 2)
      .linkDistance((d) => {

        if (d.source.rank == 'history' && d.source.histLevel >= 0) return STYLES.largeNodeSize * 2
        else if (d.source.rank == 'history') return STYLES.smallNodeSize
        else return STYLES.largeNodeSize * 1.4

      })
      .size([this.width, this.height])
      .start()
      // We define our own drag functions, allow for greater controll over the way
      // it works
    this.node_drag = this.force.drag()
      .on('dragend', this.dragEnd)
      .on('drag', function () {
        d3.event.sourceEvent.stopPropagation()
      })
      .on('dragstart', function () {
        d3.event.sourceEvent.stopPropagation()
      })


  }.bind(this)




  // Draws the dark gray circle behind the main node.
  drawBackground = function () {
    this.svg.append('svg:rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'white')


    this.svg.append('svg:circle')
      .attr('cx', this.width * 0.5)
      .attr('cy', this.height * 0.5)
      .attr('r', this.largeNodeSize * 0.57)
      .style('fill', STYLES.lightGrayColor)

    if (this.MAX_VISIBLE_NUMBER_OF_NODES < this.numberOfAdjcent) {




      //draw dotted line to indicate there are more nodes

      for (var i = 0; i < 12; i++) {
        this.svg.append('svg:circle')
          .attr('class', 'dots')
          .attr('cx', this.width * 0.5)
          .attr('cy', (this.height * 0.5) - (i * 10) - (this.largeNodeSize * 0.9))
          .attr('r', this.largeNodeSize * 0.02)
          .style('fill', STYLES.lightGrayColor)
      }
      this.svg.append('svg:circle')
        .attr('cx', this.width * 0.5)
        .attr('cy', this.height * 0.5)
        .attr('r', this.largeNodeSize * 0.57)
        .style('fill', STYLES.lightGrayColor)


      this.arch = this.MAX_VISIBLE_NUMBER_OF_NODES / this.numberOfAdjcent

      this.archAngle = 360 / this.numberOfAdjcent

      this.arc = d3.svg.arc()
        .innerRadius(this.largeNodeSize * 0.5)
        .outerRadius(this.largeNodeSize * 0.57)
        .startAngle(0)


      this.dial = this.svg.append('path')
        .attr('class', 'dial')
        .datum({
          endAngle: 2 * Math.PI * this.arch
        })
        .style('fill', STYLES.grayColor)
        .attr('d', this.arc)
        .attr('transform', 'translate(' + this.width * 0.5 + ',' + this.height * 0.5 + ')')

      this.indicator()

    }

  }.bind(this)


  indicator = function(){


    let angle = Math.PI/14

    for (let i = 0; i < 8; i++) {
      this.svg.append('svg:circle')
      .attr('class', 'indicator')
      .attr('cx', Math.sin(angle * (i + 5.5)) * STYLES.largeNodeSize * 2.5 + this.center.x)
      .attr('cy', Math.cos(angle * (i + 5.5)) * STYLES.largeNodeSize * 2.5 + this.center.y)
      .attr('r', this.largeNodeSize * 0.3)
      .style('fill', STYLES.grayColor)
      .attr('opacity', 0)
      .transition().duration(STYLES.nodeTransitionDuration*0.3).delay(100*i)
      .attr('opacity', 1)
      .transition().duration(STYLES.nodeTransitionDuration*0.8)
      .attr('opacity', 0)
    }


  }



  // Draws the nodes
  drawNodes = function () {
    console.log('drawing!!!')

    // this.svg.call(this.back_drag)

    let self = this
      // These make the following statements shorter
    let largeNode = this.largeNodeSize
    let smallNode = this.smallNodeSize

    let defsFull = this.svg.append('svg:defs')
    defsFull.append('svg:pattern')
      .attr('id', 'full')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', (STYLES.largeNodeSize / STYLES.fullScreenButtonPosition) - STYLES.fullScreenButton / 2)
      .attr('y', -(STYLES.largeNodeSize / STYLES.fullScreenButtonPosition) - STYLES.fullScreenButton / 2)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', 'img/full.jpg')
      .attr('width', STYLES.fullScreenButton)
      .attr('height', STYLES.fullScreenButton)



    // We draw the lines for all the elements in the dataLinks array.


    this.link = this.svg.selectAll('line')
    .data(this.currentDataLinks)
    .enter()
    .insert('line', '.dial')
    .attr('class','link')
    .attr('stroke-width', () => {
      // Capped at 13, found it to look the best
      return this.width / 45 > 13 ? 13 : this.width / 45})
    .attr('stroke', STYLES.lightGrayColor)


    // We draw a node for each element in the dataNodes array
    this.node = this.svg.selectAll('.node')
      .data(this.currentDataNodes, (d) => {
        return (d.uri + d.connection)
      })
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(this.node_drag)

    this.svg.selectAll('.node')
      .data(this.currentDataNodes, (d) => {
        return (d.uri + d.connection)
      })
      .exit().remove()

    this.svg.selectAll('line')
      .data(this.currentDataLinks)
      .exit().remove()

    //add avatars

    let defsImages = this.node.append('svg:defs')
    defsImages.append('svg:pattern')
      .attr('id', (d) => d.uri + d.connection)
      .attr('class', 'image')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', (d) => {
        return d.rank == 'center' ? -largeNode / 2 : -smallNode / 2
      })
      .attr('y', (d) => {
        return d.rank == 'center' ? -largeNode / 2 : -smallNode / 2
      })
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', (d) => d.img)
      .attr('width', (d) => {
        return d.rank == 'center' ? largeNode : smallNode
      })
      .attr('height', (d) => {
        return d.rank == 'center' ? largeNode : smallNode
      })
      .attr('preserveAspectRatio', 'xMinYMin slice')

    // These will be later used in the add node function, therefore they have
    // to be reachable
    this.defsFilter = this.svg.append('svg:defs')
    this.filter = this.defsFilter.append('filter')
      .attr('id', 'darkblur')

    // SourceAlpha refers to opacity of graphic that this filter will be applied to
    // convolve that with a Gaussian with standard deviation 3 and store result
    // in blur
    // This basically takes care of blurring
    this.filter.append('feGaussianBlur')
      .attr('stdDeviation', 1.5)
    this.componentTransfer = this.filter.append('feComponentTransfer')
    this.componentTransfer.append('feFuncR')
      .attr('type', 'linear')
      .attr('slope', 0.3)
    this.componentTransfer.append('feFuncG')
      .attr('type', 'linear')
      .attr('slope', 0.3)
    this.componentTransfer.append('feFuncB')
      .attr('type', 'linear')
      .attr('slope', 0.3)

    let defsShadow = this.svg.append('svg:defs')

    let filterShadow = defsShadow.append('filter')
      .attr('id', 'drop-shadow')

    filterShadow.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 1)
      .attr('result', 'blur')

    // translate output of Gaussian blur to the right and downwards with 2px
    // store result in offsetBlur
    filterShadow.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', -1.5)
      .attr('dy', 1.5)
      .attr('result', 'offsetBlur')

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    let feMerge = filterShadow.append('feMerge')

    feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur')
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic')

    this.node.append('circle')
      .attr('class', 'nodecircle')
      .attr('r', (d) => {
        if (d.rank == 'center')
          return largeNode / 2
        else if (d.rank == 'history') {
          return smallNode / 3
        } else return smallNode / 2
      })
      .style('fill', (d) => {
        if (d.img && d.rank != 'history') return 'url(#' + d.uri + d.connection + ')'
        else {
          if (d.rank == 'history') {
            return STYLES.grayColor
          } else if (d.rank == 'unavailable') {
            return STYLES.grayColor
          } else if (d.rank === 'center') {
            return theme.graph.centerNodeColor
          } else {
            return theme.graph.nodeColor
          }
        }
      })

    // The name of the person, displays on the node
    this.node.append('svg:text')
      .attr('class', 'nodetext')
      .style('fill', '#F0F7F5')
      .attr('text-anchor', 'middle')
      .attr('opacity', (d) => {
        if (d.img && d.rank != 'history') return 0
        else return 1
      })
      .attr('dy', '.35em')
      .attr('font-size', (d) => d.rank == 'history' ? STYLES.largeNodeSize / 12 :

STYLES.largeNodeSize / 8)
      .style('font-weight', 'bold')
      // In case the rdf card contains no name
      .text((d) => {
        if (d.name) return d.name
        else if (d.fullName) return d.fullName
        else if (d.title) {
          if (d.title.length > 7) return d.title.substring(0, 7) + '...'
          else return d.title
        } else return 'Not Found'
      })

    // The text description of a person
    this.node.append('svg:text')
      .attr('class', 'nodedescription')
      .style('fill', '#F0F7F5')
      .attr('text-anchor', 'middle')
      .attr('opacity', 0)
      .attr('dy', '0.5em')
      .style('font-size', '80%')
      .text(function (d) {
        // In case the person has no description available.
        if (d.description) {
          if (d.description.length > 45) return (d.description.substring(0, 45) + '...')
          else return d.description
        }
      })
      // This wraps the description nicely.
      .call(this.wrap, STYLES.largeNodeSize * 0.75, ' ', ' ')

    let full = this.node.append('circle')
      .attr('class', 'nodefullscreen')
      .attr('r', 0)
      .style('fill', 'url(#full)')
      .attr('cy', -STYLES.largeNodeSize / STYLES.fullScreenButtonPosition)
      .attr('cx', STYLES.largeNodeSize / STYLES.fullScreenButtonPosition)
      .style('filter', 'url(#drop-shadow)')

    // Subscribe to the click listeners
    this.node.on('click', function (data) {
      self.onClick(this, data)
    })
    this.node.on('dblclick', function (data) {
      self.onDblClick(this, data)
    })

    full.on('click', function (data) {
      self.onClickFull(this, data)
    })


    this.force.on('tick', this.tick)
  }.bind(this)

  // This function fires upon tick, around 30 times per second?
  tick = function (e) {
    let center = {
      y: (this.height / 2),
      x: this.width / 2
    }
    let k = 1 * e.alpha
    d3.selectAll('g .node').attr('d', function (d) {
      if (d.rank == 'center') {
        d.x = center.x
        d.y = center.y
      } else if (d.rank == 'history') {
        d.x += (center.x - d.x) * k
        if (d.histLevel == 0) {
          d.y += (center.y - d.y + STYLES.largeNodeSize * 2) * k
        } else d.y += (center.y - d.y + STYLES.largeNodeSize * 2 + (STYLES.smallNodeSize / 3) *

(d.histLevel + 1)) * k
      }
    })

    if (this.numberOfAdjcent > this.MAX_VISIBLE_NUMBER_OF_NODES) {


      d3.selectAll('.node').attr('d', (d) => {
        if (d.rank == 'adjacent') {
          d.x += (this.nodePositions[d.position].x - d.x) * k
          d.y += (this.nodePositions[d.position].y - d.y) * k

        }
      })
    }
    // Update the link positions.
    d3.selectAll('.link')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
      // Update the node positions. We use translate because we are working with
      // a group of elements rather than just one.
    d3.selectAll('g .node').attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
  }.bind(this)

  // We check if the node is dropped in the center, if yes we navigate to it.
  // We also prevent the node from bouncing away in case it's dropped to the middle
  dragEnd = function (node) {
    this.force.stop()
    if (node.rank == 'center' || node.rank == 'unavailable') {
      this.force.start()
        // In here we would have the functionality that opens the node's card
    } else if (node.rank == 'adjacent' || node.rank == 'history') {
      // We check if the node is dropped on top of the middle node, if yes
      // We change the perspective
      let w = this.width
      let h = this.height
      let size = STYLES.largeNodeSize
      let x = node.x > w / 2 - size / 2 && node.x < w / 2 + size / 2
      let y = node.y > h / 2 - size / 2 && node.y < h / 2 + size / 2

      // If in the area we navigate to the node, otherwise we start the force
      // layout back
      if (x && y) {
        this.emit('center-changed', node)
      } else this.force.start()
    }
  }.bind(this)

  // This basically pushes a node to the dataNodes and a link to the dataLinks
  // Arrays. Then tells d3 to draw a node for each of those.
  addNode = function () {
    this.force.stop()
    this.sortNodes()
    this.force.nodes(this.currentDataNodes)
    this.force.links(this.currentDataLinks)
    this.drawNodes()
    this.force.start()
  }.bind(this)

  // Enlarges and displays extra info about the clicked node, while setting
  // all other highlighted nodes back to their normal size


  sortNodes = function () {

    if (this.numberOfAdjcent <= this.MAX_VISIBLE_NUMBER_OF_NODES) {
      this.currentDataNodes = this.dataNodes
      this.currentDataLinks = this.dataLinks
      return
    }

    d3.select('.dial').attr('transform', 'translate(' + this.width * 0.5 + ',' + this.height * 0.5

+ ') rotate(' + this.archAngle * this.index + ')')
      // d3.select('.dial').transition()
      //   .duration(100)
      //   .call(this.arcTween, 2*Math.PI*(this.index+1)/this.numberOfAdjcent)

    this.currentDataNodes = []
    this.currentDataLinks = []
    this.currentDataNodes[0] = this.dataNodes[0]
    let nodeCount = 0
    let first = true

    for (let i = this.index + 1; i != this.index; i = (i + 1) % this.dataNodes.length) {

      if (this.dataNodes[i].rank == 'adjacent' && nodeCount < this.MAX_VISIBLE_NUMBER_OF_NODES) {
        this.currentDataNodes.push(this.dataNodes[i])
        this.currentDataNodes[this.currentDataNodes.length - 1].position = nodeCount
        this.currentDataNodes[this.currentDataNodes.length - 1].x = this.nodePositions[nodeCount].x
        this.currentDataNodes[this.currentDataNodes.length - 1].y = this.nodePositions[nodeCount].y
        this.currentDataNodes[this.currentDataNodes.length - 1].px = this.nodePositions

[nodeCount].x
        this.currentDataNodes[this.currentDataNodes.length - 1].py = this.nodePositions

[nodeCount].y
        this.currentDataLinks.push({
          'source': this.currentDataNodes.length - 1,
          'target': 0
        })
        nodeCount++
      }

    }
    for (var i = 0; i < this.dataNodes.length; i++) {
      if (this.dataNodes[i].rank == 'history') {
        this.currentDataNodes.push(this.dataNodes[i])
        if (first) {
          this.currentDataLinks.push({
            'source': this.currentDataNodes.length - 1,
            'target': 0
          })
          first = false
        } else {
          this.currentDataLinks.push({
            'source': this.currentDataNodes.length - 1,
            'target': this.currentDataNodes.length - 2
          })
        }
      }
    }




  }.bind(this)

  arcTween = function (transition, newAngle) {
    let arc = d3.svg.arc()
        .innerRadius(this.largeNodeSize* 0.5)
        .outerRadius(this.largeNodeSize* 0.57)
        .startAngle(0)

    transition.attrTween('d', function(d) {

      var interpolate = d3.interpolate(d.endAngle, newAngle)

      return function(t) {

        d.endAngle = interpolate(t)

        return arc(d)
      }
    })
  }.bind(this)


  onClickFull = function (node, data) {
    //stops propagation to node click handler
    this.emit('view-node', data, node)
    d3.event.stopPropagation()
  }

  onClick = function (node, data) {
    d3.event.stopPropagation()
      // d3.event.defaultPrevented returns true if the click event was fired by
      // a drag event. Prevents a click being registered upon drag release.
    this.emit('select', data, node)

    if (data.rank == 'history') return
    if (d3.event.defaultPrevented) {
      return
    }


    let smallSize = STYLES.smallNodeSize
    let largeSize = STYLES.largeNodeSize

    data.wasHighlighted = data.highlighted

    // We set all the circles back to their normal sizes
    d3.selectAll('g .node')
      .filter(function (d) {
        return d.highlighted
      })
      .selectAll('.nodecircle')
      .transition('reset').duration(STYLES.nodeTransitionDuration)
      .attr('r', (d) => {
        return d.rank == 'center' ? largeSize / 2 : smallSize / 2
      })

    d3.selectAll('g .node').filter(function (d) {
      return d.highlighted && !d.img
    })
      .select('.nodecircle')
      .transition('resetcolor').duration(STYLES.nodeTransitionDuration)
      .style('fill', (d) => {
        if (d.rank == 'history') {
          return STYLES.grayColor
        } else if (d.rank == 'unavailable') {
          return STYLES.grayColor
        } else if (d.rank === 'center') {
          return theme.graph.centerNodeColor
        } else {
          return theme.graph.nodeColor
        }
      })


    // Setting all the pattern sizes back to normal.
    d3.selectAll('g .node').filter(function (d) {
      return d.highlighted
    })
      .selectAll('pattern')
      .transition('pattern').duration(STYLES.nodeTransitionDuration)
      .attr('x', (d) => {
        return d.rank == 'center' ? -largeSize / 2 : -smallSize / 2
      })
      .attr('y', (d) => {
        return d.rank == 'center' ? -largeSize / 2 : -smallSize / 2
      })

    // Setting all the image sizes back to normal
    d3.selectAll('g .node')
      .filter(function (d) {
        return d.highlighted
      })
      .selectAll('image')
      .transition('image').duration(STYLES.nodeTransitionDuration)
      .attr('width', (d) => {
        return d.rank == 'center' ? largeSize : smallSize
      })
      .attr('height', (d) => {
        return d.rank == 'center' ? largeSize : smallSize
      })
      .style('filter', null)

    // We set the name of the node to invisible in case it has a profile picture
    // In case the node has no picture, we display it's name.
    d3.selectAll('g .node')
      .filter(function (d) {
        return d.highlighted
      })
      .selectAll('.nodetext')
      .transition('reset').duration(STYLES.nodeTransitionDuration)
      .attr('dy', '.35em')
      .attr('opacity', (d) => {
        return d.img ? 0 : 1
      })


    // We set the node description to be invisible
    d3.selectAll('g .node')
      .filter(function (d) {
        return d.highlighted
      })
      .selectAll('.nodedescription')
      .transition('description').duration(STYLES.nodeTransitionDuration)
      .attr('opacity', 0)

    //We make the fullscreen button smaller
    d3.selectAll('g .node')
      .filter(function (d) {
        return d.highlighted
      })
      .selectAll('.nodefullscreen')
      .transition('reset').duration(STYLES.nodeTransitionDuration)
      .attr('r', 0)

    d3.selectAll('g .node')
      .attr('d', (d) => d.highlighted = false)

    if (data.wasHighlighted) {
      data.highlighted = false
      this.emit('deselect')
    } else {
      // NODE signifies the node that we clicked on. We enlarge it
      d3.select(node).select('circle')
        .transition('grow').duration(STYLES.nodeTransitionDuration)
        .attr('r', STYLES.largeNodeSize / 2)
        .attr('opacity', 1)
        .each('start', (d) => {
          if (!d.img) {
            d3.select(node).select('circle')
              .transition('highlight').duration(STYLES.nodeTransitionDuration)
              .style('fill', theme.graph.centerNodeColor)
          }
        })

      // We enlarge the pattern of the node we clicked on
      d3.select(node).select('pattern')
        .transition('pattern').duration(STYLES.nodeTransitionDuration)
        .attr('x', -STYLES.largeNodeSize / 2)
        .attr('y', -STYLES.largeNodeSize / 2)

      d3.select(node).select('.nodefullscreen')
        .transition('highlight').duration(STYLES.nodeTransitionDuration)
        .attr('r', STYLES.fullScreenButton / 2)

      // We enlarge the image of the node we clicked on
      // We also blur it a bit and darken it, so that the text displays better
      d3.select(node).select('image')
        .transition('image').duration(STYLES.nodeTransitionDuration)
        .attr('width', STYLES.largeNodeSize)
        .attr('height', STYLES.largeNodeSize)
        .style('filter', 'url(#darkblur)')

      // Tere is a slight bug when if you click on nodes really quickly, the text
      // on some fails to dissapear, needs further investigation
      // We fade in the description
      d3.select(node).selectAll('text')
        .transition('description').duration(STYLES.nodeTransitionDuration)
        .attr('opacity', 0.9)

      // We fade in the node name and make the text opaque
      d3.select(node).select('.nodetext')
        .transition('highlight').duration(STYLES.nodeTransitionDuration)
        .attr('dy', (d) => d.description ? '-.5em' : '.35em')
        .attr('opacity', 1)
      data.highlighted = true
    }
  }.bind(this)

  updateHistory = function (history) {
    if (history.length > 0) {
      this.force.stop()
      for (var i = 0; i < history.length; i++) {
        history[history.length - 1 - i].connection = 'hist'
        history[history.length - 1 - i].rank = 'history'
        history[history.length - 1 - i].connection = 'hist'
        history[history.length - 1 - i].histLevel = i

        if (i == 0) {
          this.dataNodes.push(history[history.length - 1 - i])
          this.dataLinks.push({
            source: this.dataNodes.length - 1,
            target: 0
          })
        } else {
          this.dataNodes.push(history[history.length - 1 - i])
          this.dataLinks.push({
            source: this.dataNodes.length - 1,
            target: this.dataNodes.length - 2
          })
        }
      }
      this.sortNodes()
      this.force.nodes(this.currentDataNodes)
      this.force.links(this.currentDataLinks)
      this.drawNodes()
      this.force.start()
    }
    this.drawNodes()
  }.bind(this)

  // Wraps the description of the nodes around the node.
  // http://bl.ocks.org/mbostock/7555321
  wrap = function (text, width, separator, joiner) {
    if (separator == undefined) {
      separator = /\s+/
      joiner = ' '
    }
    let hasWrapped = []
    text.each(function () {
      let text = d3.select(this)
      let words = text.text().split(separator)
      let line = []
      let lineNumber = 0
      let lineHeight = 1 // ems
      let y = text.attr('y')
      let dy = parseFloat(text.attr('dy'))
      let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em')

      for (var word of words) {
        line.push(word)
        tspan.text(line.join(joiner))
        if (tspan.node().getComputedTextLength() > width) {
          hasWrapped.push(this)
          line.pop()
          tspan.text(line.join(joiner))
          line = [word]
          lineNumber++
          tspan = text
            .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ((lineNumber == 0) ? (dy + 'em') : (lineHeight + 'em'))) //++lineNumber * lineHeight + dy + 'em') NOTE(philipp): dy is relative to previous sibling (== lineheight for all but first line)
            .text(word)
        }
      }
    })
    return hasWrapped
  }

  // Erases all the elements on the svg, but keeps the svg.
  eraseGraph = function () {
    if (this.force) this.force.stop()
    this.svg.selectAll('*').remove()
  }.bind(this)

  // Alternative to dragging the node to the center. Does the same thing pretty much
  onDblClick = function (node, data) {
    if (data.rank != 'center') {
      this.emit('center-changed', data)
    }
  }.bind(this)

  deleteNode = function (state) {
    // We don't pop it from the parent neighbours array, that should not cause problems. But
    // Keep an eye on this, in case of potential bugs.

    let index = d3.select(state.selected)[0][0].__data__.uri
    let nIndex = -1
    let lIndex = -1

    for (let i = 0; i < this.dataNodes.length; i++) {
      if (this.dataNodes[i].uri == index && this.dataNodes[i].rank == 'adjacent') {
        nIndex = i
        console.log('found deleting node at index:', nIndex)
      }
    }


    for (var i = 0; i < this.dataLinks.length; i++) {
      if(this.dataLinks[i].source.uri == index && this.dataLinks[i].source.rank == 'adjacent'){
        lIndex = i
      }
    }


    if (nIndex > this.MAX_VISIBLE_NUMBER_OF_NODES) {
      this.index = nIndex - this.MAX_VISIBLE_NUMBER_OF_NODES
      this.force.stop()
      this.sortNodes()
      this.force.nodes(this.currentDataNodes)
      this.force.links(this.currentDataLinks)
      this.drawNodes()
      this.force.start()
    }

    d3.selectAll('.node').filter(function (d) {
      return d.uri == index && d.rank == 'adjacent'
    })
      .select('pattern')
      .transition().duration(STYLES.nodeTransitionDuration / 3).delay(100)
      .attr('x', -STYLES.largeNodeSize / 2)
      .attr('y', -STYLES.largeNodeSize / 2)

    d3.selectAll('.node').filter(function (d) {
      return d.uri == index && d.rank == 'adjacent'
    })
      .select('image')
      .transition().duration(STYLES.nodeTransitionDuration / 3).delay(100)
      .attr('width', STYLES.largeNodeSize)
      .attr('height', STYLES.largeNodeSize)


    d3.selectAll('.node').filter(function (d) {
      return d.uri == index && d.rank == 'adjacent'
    })
      .select('circle')
      .transition().duration(STYLES.nodeTransitionDuration / 3).delay(100)
      .attr('r', STYLES.largeNodeSize / 2.2)
      .each('end', () => {
        console.warn('this is the end')
        this.force.stop()
        this.dataNodes.splice(nIndex, 1)
        this.dataLinks.splice(lIndex, 1)
        this.numberOfAdjcent --
        d3.select('.dial').transition()
         .duration(100)
         .call(this.arcTween, 2*Math.PI*(this.numberOfNodes/this.numberOfAdjcent))
        if(this.numberOfNodes>=this.numberOfAdjcent){
          d3.select('.dial').remove()
          d3.selectAll('.dots').remove()
        }


        this.sortNodes()
        this.force.nodes(this.currentDataNodes)
        this.force.links(this.currentDataLinks)
        this.drawNodes()
        this.force.start()
      })
  }

  // This is not implemented apparently.
  onResize = function () {
    this.setSize()
  }.bind(this)

  // Not yet implemented.
  setSize = function () {
    this.width = this.graphContainer.offsetWidth
    this.height = this.graphContainer.offsetHeight
    this.svg.attr('width', this.width).attr('height', this.height)
  }.bind(this)
}
