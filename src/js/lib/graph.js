'use strict'

// THIS FILE TAKES CARE OF DRAWING THE D3 GRAPH
// It is passed a state from the graph.jsx file, and then it draws
// the graph according to that state. The element itself is stateless.
// Currently I have issues with doing persistent changes here, for instance
// a moved node will not save upon refresh.
import * as d3 from 'd3'
import STYLES from 'styles/app'
import {EventEmitter} from 'events'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import JolocomTheme from 'styles/jolocom-theme'
// import TouchRotate from 'lib/lib/touch-rotate'
import Utils from 'lib/util'
import particles from './particles'

import Debug from 'lib/debug'
let debug = Debug('d3graph')

const theme = getMuiTheme(JolocomTheme)

export default class GraphD3 extends EventEmitter {

  constructor(el, mode) {
    super()

    this.mode = mode
    this.MAX_VISIBLE_NODES = 8
    this.HOF_URI = 'https://hof.webid.jolocom.de/profile/card#me'
    this.smallNodeSize = STYLES.smallNodeSize
    this.largeNodeSize = STYLES.largeNodeSize

    this.graphContainer = el

    this.rendered = false
    this.rotationIndex = 0

    this.svg = d3.select(this.graphContainer).append('svg:svg')
      .style('display', 'block')
      // .append('svg:g')

    this.refreshDimensions()

    this.svg
      .attr('width', this.width)
      .attr('height', this.height)

    this.svg.append('svg:g')
      .attr('class', 'background-layer')
      .append('svg:g')
      .attr('class', 'background-layer-links')

    window.removeEventListener('resize', this.onResize)
    window.addEventListener('resize', this.onResize)

    // // TouchRotate setup
    // var thisInstance = this
    // var getTouchRotateCallbacks = function () {
    //   var lastNotchRadian = false
    //   var amountOfTurns = 0
    //
    //   return {
    //     move: function (touchMoveRadian) {
    //       // closure isn't functional #todo
    //       // Normalization of touchMoveRadian
    //       //   Quick fix because touchMoveRadian abruptly switches from
    //       // (+3/2 * PI) to (-1/2 * PI)
    //       //   This doesn't pose any problem when using touchMoveRadian
    //       // as an absolute value, but if we are comparing the new
    //       // touchMoveRadian to the previous one, then it is problematic
    //       var radianDiff = touchMoveRadian - lastNotchRadian
    //       let MAX_VISIBLE = thisInstance.MAX_VISIBLE_NODES
    //       let numberOfNeighbours = thisInstance.numberOfNeighbours
    //       let rotationIndex = thisInstance.rotationIndex
    //       if (radianDiff < -Math.PI) {
    //         radianDiff = touchMoveRadian + Math.PI * 2 - lastNotchRadian
    //       } else if (radianDiff > Math.PI) {
    //         radianDiff = lastNotchRadian - (touchMoveRadian + Math.PI * 2)
    //       }
    //
    //       // first drag
    //       if (lastNotchRadian === false) {
    //         lastNotchRadian = touchMoveRadian
    //         thisInstance.emit('start-scrolling')
    //       } else if (radianDiff < -Math.PI / MAX_VISIBLE * 2 / 3) {
    //         lastNotchRadian = touchMoveRadian
    //         amountOfTurns++
    //         if (rotationIndex < numberOfNeighbours - MAX_VISIBLE) {
    //           thisInstance.rotationIndex++
    //           thisInstance.emit('change-rotation-index',
    //           thisInstance.rotationIndex)
    //           thisInstance.updateAfterRotationIndex('up')
    //         }
    //       } else if (radianDiff > Math.PI / MAX_VISIBLE * 2 / 3) {
    //         // @todo constant / not stateless
    //         lastNotchRadian = touchMoveRadian
    //         amountOfTurns--
    //         if (thisInstance.rotationIndex > 0) {
    //           thisInstance.rotationIndex--
    //           thisInstance.emit('change-rotation-index',
    //           thisInstance.rotationIndex)
    //           thisInstance.updateAfterRotationIndex('down')
    //         }
    //       }
    //       if (amountOfTurns > MAX_VISIBLE * 7 ||
    //         amountOfTurns < -MAX_VISIBLE * 7) {
    //         if (thisInstance.dataNodes[0].uri !== thisInstance.HOF_URI) {
    //          thisInstance.emit('center-changed', {uri: thisInstance.HOF_URI})
    //           amountOfTurns = 0
    //         }
    //       }
    //     },
    //     end: function () {
    //       amountOfTurns = 0
    //       lastNotchRadian = false
    //     }
    //   }
    // }
    //
// this.touch = new TouchRotate(this.graphContainer, getTouchRotateCallbacks())
  }

  // Function to be called when the state changes
  render = function (state) { // nodes
    this.state = state
    if (this.rendered) {
      this.eraseGraph() // erase everything, including background
    }

    debug('Rendering with state', state)

    this.rendered = true

    this.refreshDimensions() // ?
    this.orderNodes()
    // if render is the changeNodes function, then this makes sense.

    // Update dataNodes
    this.dataNodes = [state.center]
    this.dataLinks = []
    this.numberOfNeighbours = 0
    if (state.center.uri === this.HOF_URI && this.mode !== 'preview') {
      particles.party(this.graphContainer)
    } else {
      particles.unparty(this.graphContainer)
    }

    // Flatten the center and neighbour nodes we get from the state
    for (let i = 0; i < state.neighbours.length; i++) {
      this.dataNodes.push(state.neighbours[i])
      this.dataLinks.push({
        'source': this.dataNodes[this.dataNodes.length - 1],
        'target': this.dataNodes[0]
      })
      this.numberOfNeighbours++
    }

    // Start up everything
    this.setUpVisibleNodes()
    // <- creates force and starts it. why does it
    // need to be done several times?
    this.drawBackground()
    // refresh the background in case we need to draw
    // more things because for instance scrolling is now enabled
    this.d3update()
  }.bind(this)

  refreshDimensions = function () {
    this.width = this.graphContainer.offsetWidth || STYLES.width
    this.height = this.graphContainer.offsetHeight || STYLES.height
    this.centerCoordinates = {
      y: this.height / 2,
      x: this.width / 2
    }
  }

  orderNodes= function () {
    this.state.neighbours.sort(function(a, b) {
      let A = (a.name || a.title || 'zzzzzz').toLowerCase()
      let B = (b.name || b.title || 'zzzzzz').toLowerCase()
      if (A > B) {
        return 1
      } else if (A < B) {
        return -1
      } else {
        return 0
      }
    })
  }

  // Draws the scrolling scrollingIndicators and scrolling circle.
  drawBackground = function () {
    this.isPulsing = false
    this.svg.selectAll('.dial, .dots, .background, .center-circle').remove()
    /* this.svg.select('g.background-layer').append('svg:rect')
    `` used for the positioning of the lines; see if we need it
      .attr('class','background')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'transparent')
    */

    // Center cicle
    this.svg.select('g.background-layer').append('svg:circle')
      .attr('class', 'center-circle')
      .attr('cx', this.width * 0.5)
      .attr('cy', this.height * 0.5)
      .attr('r', this.largeNodeSize * 0.57 * 1.1)
      .style('fill', STYLES.lightGrayColor)

    if (this.numberOfNeighbours > this.MAX_VISIBLE_NODES) {
      // Draw dotted line to indicate there are more nodes
      // for (var i = 0; i < 12; i++) {
      //   this.svg.select('g.background-layer').append('svg:circle')
      //     .attr('class', 'dots')
      //     .attr('cx', this.width * 0.5)
      //     .attr('cy', (this.height * 0.5) -
      // (i * 10) - (this.largeNodeSize * 0.9))
      //     .attr('r', this.largeNodeSize * 0.02)
      //     .style('fill', STYLES.lightGrayColor)
      // }

      this.dial = this.svg.select('g.background-layer').append('path')
        .attr('class', 'dial')

      this.updateDial()

      // Emit event that indicatorOverlay should be drawn.
      // Listened to on graph.jsx
      this.emit('scrolling-drawn')
    }
  }.bind(this)

  updateDial = function() {
    // Don't do anything if we haven't received the state yet;
    // when we receive the state,
    // render() will be called, and updateDial() is called inside render()
    if (typeof this.numberOfNeighbours === 'undefined') {
      return
    }

    this.arch = this.MAX_VISIBLE_NODES / this.numberOfNeighbours

    this.archAngle = 360 / this.numberOfNeighbours

    this.arc = d3.arc()
      // shrunk size
       .innerRadius(this.largeNodeSize * 0.5)
       .outerRadius(this.largeNodeSize * 0)
       .startAngle(0)

    this.arcEnlarged = d3.arc()
      // enlarged size
      .innerRadius(this.largeNodeSize * 0.57)
      .outerRadius(this.largeNodeSize * 0)
      .startAngle(0)

    let maxRotationIndex = this.numberOfNeighbours - this.MAX_VISIBLE_NODES
    let trans = this.width * 0.5 + ',' + this.height * 0.5
    let rot = this.archAngle * (maxRotationIndex - this.rotationIndex)
    // remove "maxRotationIndex -" to reverse the direction
    this.svg.select('.dial')
      .attr('transform', 'translate(' + trans + ') rotate(' + rot + ')')
      .datum({
        endAngle: 2 * Math.PI * this.arch
      })
      .style('fill', theme.graph.dialColor)
      .attr('d', this.arc)
  }

  // d3 "update" routine
  d3update = function () {
    let self = this
    // These make the following statements shorter
    let largeNode = this.largeNodeSize
    let smallNode = this.smallNodeSize
    // "View node info" button
    // @TODO should be in render and not inside the update pattern

    // LINKS DATA JOIN
    this.link = this.svg.select('.background-layer .background-layer-links')
      .selectAll('line')
      .data(this.visibleDataLinks, (d) => {
        return (d.source.uri + d.source.connection)
      })

    // LINKS ENTER
    // We draw the lines for all the elements in the dataLinks array.
    // this.link should be the enter stuff neh?
    this.link
      .enter()
        .append('line')
        .attr('class', 'link')
        .attr('stroke-width', () => {
          // Capped at 13, found it to look the best
          return this.width / 50 > 10 ? 10 : this.width / 50
        })
        .attr('stroke', STYLES.lightGrayColor)
        .attr('opacity', (d) => {
          d.source.rank === 'elipsis' ? 0 : 1
        })
        .attr('x1', this.centerCoordinates.x)
        .attr('y1', this.centerCoordinates.y)
        .attr('x2', this.centerCoordinates.x)
        .attr('y2', this.centerCoordinates.y)

    // LINKS EXIT
    this.link
      .exit()
        .remove()

    this.link.merge(this.link)
    // NODES DATA JOIN
    this.node = this.svg.selectAll('.node').data(this.visibleDataNodes, (d) => {
      return (d.uri + d.connection)
    })

    // NODES ENTER
    // We draw a node for each element in the dataNodes array
    let nodeEnter = this.node
      .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => {
          let x = this.centerCoordinates.x
          let y = this.centerCoordinates.y
          if (d.rank !== 'center') {
            if (d.rank === 'history') {
              y += largeNode * 2
            } else {
              y += largeNode
            }
          }
          return 'translate(' + x + ',' + y + ')'
        })

    // NODES EXIT
    this.node
      .exit()
      .remove()
      .merge(this.node)

    // add avatars
    // @todo review following code / integrate better

    let defsImages = nodeEnter.filter((d) => d.type !== 'passport' && d.img)
      .append('svg:defs')

    defsImages.append('svg:pattern')
      .attr('id', (d) => d.uri + d.connection)
      .attr('class', 'image')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', (d) => {
        return d.rank === 'center' ? -largeNode / 2 : -smallNode / 2
      })
      .attr('y', (d) => {
        return d.rank === 'center' ? -largeNode / 2 : -smallNode / 2
      })
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', (d) => {
        if (d.rank === 'elipsis') {
          return d.img
        } else {
          return Utils.uriToProxied(d.img)
        }
      })
      .attr('width', (d) => {
        return d.rank === 'center' ? largeNode : smallNode
      })
      .attr('height', (d) => {
        return d.rank === 'center' ? largeNode : smallNode
      })
      .attr('preserveAspectRatio', 'xMinYMin slice')

    // These will be later used in the add node function, therefore they have
    // to be reachable
    this.defsFilter = this.svg.append('svg:defs')
    this.filter = this.defsFilter.append('filter')
      .attr('id', 'darkblur')

    // SourceAlpha refers to opacity of graphic
    // that this filter will be applied to
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
      .attr('stdDeviation', 0.8)
      .attr('result', 'blur')

    // translate output of Gaussian blur to the right and downwards with 2px
    // store result in offsetBlur
    filterShadow.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 0)
      .attr('dy', 0.5)
      .attr('result', 'offsetBlur')

    // controls the color/opacity of drop shadow
    filterShadow.append('feFlood')
        .attr('in', 'offsetBlur')
        .attr('flood-color', '#2c2c2c')
        .attr('flood-opacity', '0.6')
        .attr('result', 'offsetColor')

    filterShadow.append('feComposite')
        .attr('in', 'offsetColor')
        .attr('in2', 'offsetBlur')
        .attr('operator', 'in')
        .attr('result', 'offsetBlur')

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    let feMerge = filterShadow.append('feMerge')

    feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur')
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic')

    // Used as a background circle for image nodes
    nodeEnter.append('circle')
      .attr('class', 'nodeback')
      .attr('r', 0)
      .attr('fill', theme.graph.imageNodeColor)
      .attr('opacity', 0)

    nodeEnter.append('circle')
      .attr('class', 'nodecircle')
      .attr('r', 0)
      .attr('fill', (d) => {
        if (d.rank === 'elipsis') {
          return theme.graph.textNodeColor
        } else {
          return theme.graph.transitionStartNodeColor
        }
      })
      .attr('opacity', 0)
    // The name of the person, displays on the node
    nodeEnter.filter((d) => d.rank !== 'elipsis').append('svg:text')
      .attr('class', 'nodetext')
      .style('fill', '#F0F7F5')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', (d) => {
        return d.rank === 'history' ? largeNode / 12 : largeNode / 8
      })
      // In case the rdf card contains no name
      .text((d) => {
        if (d.unavailable) {
          return 'Not found'
        } else if (d.name) {
          if (d.name.length > 7) {
            return d.name.substring(0, 7) + '...'
          } else {
            return d.name
          }
        } else if (d.fullName) {
          if (d.fullName.length > 7) {
            return d.fullName.substring(0, 7) + '...'
          } else {
            return d.fullName
          }
        } else if (d.title) {
          if (d.title.length > 7) {
            return d.title.substring(0, 7) + '...'
          } else {
            return d.title
          }
        } else {
          return 'Unnamed'
        }
      })
      .attr('opacity', 0)
      .transition().delay(50)
      .attr('opacity', (d) => {
        if (d.rank === 'elipsis') {
          return 0
        } else if (d.img && d.rank !== 'history' && d.type !== 'passport') {
          return 0
        } else {
          return 1
        }
      })

    // Add class hasNodeIcon
    // Adds a Confidential Icon for confidential nodes
    nodeEnter.filter((d) => d.confidential)
      .classed('hasNodeIcon', true)
      .append('image')
        .attr('class', 'nodeIcon')
        .attr('xlink:href', (d) => {
          if (d.confidential) {
            // Don't display on elipsis nodes @TODO
            return 'img/lock-01.png'
          } else {
            return ''
          }
        })
        // Not completely aligned for center nodes
        .attr('x', (d) => {
          if (d.rank === 'center') {
            return -75
          } else {
            return -60
          }
        })
        .attr('y', (d) => {
          if (false && d.rank === 'center') {
            return -55
          } else {
            return -50 // not taken into account?
          }
        })

    // The text description of a person
    nodeEnter.append('svg:text')
      .attr('class', 'nodedescription')
      .style('fill', '#F0F7F5')
      .attr('text-anchor', 'middle')
      .attr('opacity', 0)
      .attr('dy', function (d) {
        return d3.select(this.parentNode).classed('hasNodeIcon')
          ? '1.95em'
          : '0.95em'
      })
      .style('font-size', '80%')
      .text(function (d) {
        if (d.type === 'bitcoin') {
          return ''
        }

        // In case the person has no description available.
        if (d.description) {
          if (!d.description.includes(' ')) {
            // if the description does not contain words i.e f94hcnfsadfs9
            if (d.description.length > 12) {
              return (d.description.substring(0, 12) + '...')
            } else {
              return d.description
            }
          } else {
            // if description contains words with spaces i.e Bitcoin Key Address
            if (d.description.length > 45) {
              return (d.description.substring(0, 45) + '...')
            } else {
              return d.description
            }
          }
        }
      })
      // This wraps the description nicely.
      .call(this.wrap, STYLES.largeNodeSize * 0.75, ' ', ' ')

    // Subscribe to the click listeners for arrow nodes
    this.node.on('mousedown', function (data) {
      self.mouseDown = true
      if (data.rank === 'elipsis') {
        let dir = 1
        if (data.connection === 'backButton') {
          dir = -1
        }
        self.onHoldClick(dir)
      }
    })

    // Subscribe to the click listeners for neighbour nodes
    this.node.on('click', function (data) {
      self.mouseDown = false
      if (data.rank !== 'elipsis') {
        if (!self.last || (d3.event.timeStamp - self.last) > 500) {
          self.onClick(this, data)
          self.last = d3.event.timeStamp
        } else {
          self.onDblClick(this, data)
        }
      }
    })

    // Subscribe to the double click listeners for neighbour nodes
    this.node.on('dblclick', function (data) {
      if (data.rank === 'elipsis') {
        return
      }
      self.onDblClick(this, data)
    })

    // Add drag listeners to neighbour nodes

    this.node.call(d3.drag().on('drag', this.drag)
                            .on('start', this.dragStart)
                            .on('end', this.dragEnd))

    // Add click behaviour on background so that a click will deselect nodes.

    this.svg.on('click', function (data) {
      self.mouseDown = false
      self.deselectAll()
    })

    // this.svg.on('wheel', self.onScroll)
  }.bind(this)

  // Arrow node function for rotating nodes
  onHoldClick = function (dir) {
    let self = this
    if (this.mouseDown) {
      let rotationIndex = this.rotationIndex
      let numberOfNeighbours = this.numberOfNeighbours
      let MAX_VISIBLE = this.MAX_VISIBLE_NODES
      if (dir === 1) {
        if (rotationIndex < numberOfNeighbours - MAX_VISIBLE) {
          this.rotationIndex++
          this.emit('change-rotation-index',
          this.rotationIndex)
          this.updateAfterRotationIndex('up')
        }
      } else {
        if (rotationIndex > 0) {
          this.rotationIndex--
          this.emit('change-rotation-index',
          this.rotationIndex)
          this.updateAfterRotationIndex('down')
        }
      }
      setTimeout(function () {
        self.onHoldClick(dir)
      }, 150)
    }
  }.bind(this)

  dragStart = function(node) {
    if (node.rank === 'elipsis' || node.rank === 'center' || node.unavailable) {
      node.mobile = false
    } else {
      node.mobile = true
      node.position.px = node.position.x
      node.position.py = node.position.y
    }
  }

  drag = function(node) {
    if (node.mobile) {
      node.position.x += d3.event.dx
      node.position.y += d3.event.dy
      this.resetPos(0)
    }
  }.bind(this)

  // We check if the node is dropped in the center, if yes we navigate to it.

  dragEnd = function (node) {
    this.mouseDown = false

    if (node.mobile) {
      // We check if the node is dropped on top of the center node
      let w = this.centerCoordinates.x
      let h = this.centerCoordinates.y
      let size = STYLES.largeNodeSize / 2
      let x = node.position.x > w - size && node.position.x < w + size
      let y = node.position.y > h - size && node.position.y < h + size
      // If yes, we change the perspective
      if (x && y) {
        this.navigateToNode(node)
      } else {
        node.position.x = node.position.px
        node.position.y = node.position.py
        this.resetPos(100)
      }
    }
  }.bind(this)

  navigateToNode = function (node) {
    if (node.rank !== 'center') {
      node.rank = 'center'
      this.isPulsing = true
      this.dataNodes = [node]
      this.dataLinks = []
      this.numberOfNeighbours = 0
      this.setUpVisibleNodes()
      this.d3update()
      this.resetAll()
      this.resetPos()

      this.svg.select('.dial')
        .attr('opacity', 0)

      this.pulseCenter()
      this.emit('center-changed', node)
    }
  }.bind(this)

  // Enlarges and displays extra info about the clicked node, while setting
  // all other highlighted nodes back to their normal size

  setUpVisibleNodes = function () {
    // No scrolling
    let x = this.centerCoordinates.x
    let y = this.centerCoordinates.y
    let coordinates = {
      'x': x, 'y': y
    }
    this.dataNodes[0].position = coordinates

    this.nodePositions = []

    if (this.numberOfNeighbours <= this.MAX_VISIBLE_NODES) {
      this.visibleDataNodes = this.dataNodes
      this.visibleDataLinks = this.dataLinks

      let angle = (Math.PI * 2) / this.numberOfNeighbours

      for (let i = 0; i < this.dataNodes.length; i++) {
        let dist = STYLES.largeNodeSize * 1.4
        let pos = {
          x: Math.sin((Math.PI) - angle * i) * dist + this.centerCoordinates.x,
          y: Math.cos((Math.PI) - angle * i) * dist + this.centerCoordinates.y,
          p: 'neighbours'
        }

        this.nodePositions.push(pos)
      }
      for (let i = 0; i < this.dataNodes.length; i++) {
        if (this.dataNodes[i].rank === 'neighbour') {
          this.dataNodes[i].position = this.nodePositions[i - 1]
        } else if (this.visibleDataNodes[i].rank === 'history') {
          let y = this.centerCoordinates.y + this.largeNodeSize * 2.1
          y += this.dataNodes[i].histLevel * this.smallNodeSize
          let x = this.centerCoordinates.x
          let coordinates = {'x': x, 'y': y}
          this.visibleDataNodes[i].position = coordinates
        }
      }
      return
    }

    // Yes scrolling (more than 8 visible nodes)

    // Smooth radial scrolling animation
    //  d3.select('.dial').transition()
    //   .duration(100)
    //   .call(this.arcTween,
    // 2*Math.PI*(this.rotationIndex+1)/this.numberOfNeighbours)

    // Position nodes manually

    this.nodePositions = []
    let extraSpaceFront = 1
    let extraSpaceBack = 1
    let totalspace = 0
    let num = 0.5
    let largeNode = STYLES.largeNodeSize
    let center = this.centerCoordinates

    if (extraSpaceFront > 0) {
      totalspace++
    }
    if (extraSpaceBack > 0) {
      totalspace++
    }

    let angle = (2 * Math.PI) / (this.MAX_VISIBLE_NODES + totalspace)
    let first = true

    for (let i = 0,
      numberOfNeighbours = this.MAX_VISIBLE_NODES + 2;
         i < (this.numberOfNeighbours + totalspace); i++) {
      if (numberOfNeighbours > 0) {
        if (first) {
          num = 5.5
          first = false
        }
        let pos = {
          x: Math.sin((Math.PI) - (angle) * num) * largeNode * 1.4 + center.x,
          y: Math.cos((Math.PI) - (angle) * num) * largeNode * 1.4 + center.y,
          p: 'neighbours'
        }
        this.nodePositions.push(pos)
        if (numberOfNeighbours > 1) {
          num++
        }
        numberOfNeighbours--
      }
    }

    // Hydrate visibleDataNodes based on rotationIndex
    // @TODO iterate through this.neighbours rather;
    // have this.neighbourNodes, this.center, this.historyNodes
    // and not have this.dataNodes (where 0 = xx)
    this.visibleDataNodes = []
    this.visibleDataNodes[0] = this.dataNodes[0] // @TODO not intuitive
    this.visibleDataLinks = []
    let nodeCount = 0

    let backButton = {rank: 'elipsis',
      connection: 'backButton',
      position: this.nodePositions[0],
      img: 'img/arrowLeft.png'}
    let frontButton = {rank: 'elipsis',
      connection: 'frontButton',
      position: this.nodePositions[this.MAX_VISIBLE_NODES + 1],
      img: 'img/arrowRight.png'}

    this.visibleDataNodes.push(backButton)

    for (let i = this.rotationIndex + 1,
      pos = 1;
      i !== this.rotationIndex;
      i = (i + 1) % this.dataNodes.length) {
      if (this.dataNodes[i].rank === 'neighbour') {
        if (nodeCount < this.MAX_VISIBLE_NODES) {
          this.visibleDataNodes.push(this.dataNodes[i])
          let last = this.visibleDataNodes.length - 1
          this.visibleDataNodes[last].position = this.nodePositions[pos]
          nodeCount++
          pos++
        }
      }
    }

    this.visibleDataNodes.push(frontButton)

    for (let i = 1; i < this.visibleDataNodes.length; i++) {
      this.visibleDataLinks.push({
        'source': this.visibleDataNodes[i],
        'target': this.visibleDataNodes[0]
      })
    }

    first = true
    // Add history nodes to visibleDataNodes
    for (let i = 0; i < this.dataNodes.length; i++) {
      if (this.dataNodes[i].rank === 'history') {
        let y = this.centerCoordinates.y + this.largeNodeSize * 2.1
        y += this.dataNodes[i].histLevel * this.smallNodeSize
        let x = this.centerCoordinates.x
        let coordinates = {'x': x, 'y': y}
        this.dataNodes[i].position = coordinates
        this.visibleDataNodes.push(this.dataNodes[i])
        if (first) {
          this.visibleDataLinks.push({
            'source': this.dataNodes[i],
            'target': this.dataNodes[0]
          })
          first = false
        } else {
          this.visibleDataLinks.push({
            'source': this.dataNodes[i],
            'target': this.dataNodes[i - 1]
          })
        }
      }
    }
  }.bind(this)

  arcTween = function (transition, newAngle) {
    let arc = d3.arc()
      .innerRadius(this.largeNodeSize * 0.5)
      .outerRadius(this.largeNodeSize * 0.57)
      .startAngle(0)

    transition.attrTween('d', function(d) {
      var interpolate = d3.interpolate(d.endAngle, newAngle)

      return function(t) {
        d.endAngle = interpolate(t)

        return arc(d)
      }
    })
  }.bind(this)

  resetPos = function (speed) {
    if (isNaN(speed)) {
      speed = STYLES.nodeTransitionDuration / 5
    }

    d3.selectAll('.node')
      .transition('pos').duration(speed)
      .attr('transform', (d) => {
        let x = this.centerCoordinates.x
        let y = this.centerCoordinates.y
        if (d.rank === 'neighbour' ||
        d.rank === 'history' ||
        d.rank === 'elipsis') {
          x = d.position.x
          y = d.position.y
        }
        return 'translate(' + x + ',' + y + ')'
      })
    //

    d3.selectAll('.link')
      .transition().duration(speed)
      .attr('x1', (d) => d.target.position.x)
      .attr('y1', (d) => d.target.position.y)
      .attr('x2', (d) => d.source.position.x)
      .attr('y2', (d) => d.source.position.y)
  }

  resetAll = function (speed) {
    if (!speed) {
      speed = STYLES.nodeTransitionDuration
    }

    let smallSize = STYLES.smallNodeSize
    let elipsisSize = STYLES.smallNodeSize * 0.7
    let largeSize = STYLES.largeNodeSize

    // Reset radius of dial to match shrunken center node size
    this.svg.select('.dial')
      .transition('reset').duration(STYLES.nodeTransitionDuration)
      .attr('d', this.arc)

    d3.selectAll('line')
      .attr('opacity', (d) => {
        return d.source.rank === 'elipsis' ? 0 : 1
      })

    // Reset size of all circles
    d3.selectAll('svg .node')
      .selectAll('.nodecircle')
      .transition('grow').duration(speed)
      .attr('r', (d) => {
        if (d.rank === 'elipsis') {
          return elipsisSize / 2
        } else if (d.rank === 'center') {
          return ((STYLES.largeNodeSize / 2) + (STYLES.smallNodeSize / 2)) / 2
        } else if (d.rank === 'history') {
          return STYLES.smallNodeSize / 3
        } else {
          return STYLES.smallNodeSize / 2
        }
      })

    // reset size of background
    d3.selectAll('svg .node')
      .selectAll('.nodeback')
      .transition('reset').duration(speed)
      .attr('r', (d) => {
        if (d.rank === 'elipsis') {
          return elipsisSize / 2
        }
        if (d.rank === 'center') {
          return ((STYLES.largeNodeSize / 2) + (STYLES.smallNodeSize / 2)) / 2
        } else if (d.rank === 'history') {
          return STYLES.smallNodeSize / 3
        } else {
          return STYLES.smallNodeSize / 2
        }
      })
      .transition('reset').duration(100)
      .attr('opacity', (d) => {
        if (d.rank === 'elipsis') {
          let rotationIndex = this.rotationIndex
          let numberOfNeighbours = this.numberOfNeighbours
          let MAX_VISIBLE = this.MAX_VISIBLE_NODES
          if (d.connection === 'backButton') {
            if (rotationIndex === 0) {
              return 0.4
            }
          } else if (rotationIndex === numberOfNeighbours - MAX_VISIBLE) {
            return 0.4
          }
        } else {
          return 1
        }
      })

    // Reset colour of all circles
    // Tries to interpret the url(#) as a colour @TODO
    d3.selectAll('svg .node')
      .select('.nodecircle')
      .style('fill', (d) => {
        if (d.rank === 'history') {
          return STYLES.grayColor
        } else if (d.type === 'passport') {
          return theme.graph.textNodeColor
        } else if (d.unavailable) {
          return STYLES.unavailableNodeColor
        } else if (d.img) {
          return 'url(#' + d.uri + d.connection + ')'
        } else if (d.rank === 'center') {
          return theme.graph.centerNodeColor
        } else {
          return theme.graph.textNodeColor
        }
      })
      .transition('reset').duration(100)
      .attr('opacity', 1)

    // Reset sizes of all patterns
    d3.selectAll('svg .node')
      .selectAll('pattern')
      .transition('pattern').duration(speed)
      .attr('x', (d) => {
        if (d.rank === 'center') {
          return -largeSize / 2
        } else if (d.rank === 'elipsis') {
          return -elipsisSize / 2
        } else {
          return -smallSize / 2
        }
      })
      .attr('y', (d) => {
        if (d.rank === 'center') {
          return -largeSize / 2
        } else if (d.rank === 'elipsis') {
          return -elipsisSize / 2
        } else {
          return -smallSize / 2
        }
      })

    // Reset sizes of all images
    d3.selectAll('svg .node')
      .selectAll('image')
      .transition('image').duration(STYLES.nodeTransitionDuration)
      .attr('width', (d) => {
        if (d.rank === 'center') {
          return largeSize
        } else if (d.rank === 'elipsis') {
          return elipsisSize
        } else {
          return smallSize
        }
      })
      .attr('height', (d) => {
        if (d.rank === 'center') {
          return largeSize
        } else if (d.rank === 'elipsis') {
          return elipsisSize
        } else {
          return smallSize
        }
      })
      .style('filter', null)

    // Reset sizes of all confidential icons without unnecessary animation
    d3.selectAll('svg .node')
      .selectAll('.nodeIcon')
      .attr('width', (d) => {
        return d.rank === 'center' ? largeSize : smallSize
      })
      .attr('height', (d) => {
        return d.rank === 'center' ? largeSize : smallSize
      })
      .transition('reset').duration(STYLES.nodeTransitionDuration)
      .attr('y', (d) => {
        if (d.rank === 'center') {
          return -55
        } else {
          return -50
        }
      })
      .style('filter', null)

    // We set the name of the node to invisible in case it has a profile picture
    // In case the node has no picture, we display its name.
    d3.selectAll('svg .node')
      .selectAll('.nodetext')
      .transition('reset').duration(speed)
      .attr('dy', function (d) {
        return d3.select(this.parentNode).classed('hasNodeIcon')
          ? (d.rank === 'center' ? '0.95em' : '.75em')
          : '.35em'
      })
      .attr('opacity', (d) => {
        return (((d.img && d.type !== 'passport') || d.rank === 'elipsis') &&
                d.rank !== 'history')
                ? 0
                : 1
      })

    // Hide the descriptions of all nodes
    d3.selectAll('svg .node')
      .selectAll('.nodedescription')
      .transition('description').duration(speed)
      .attr('opacity', 0)

    // Un-highlight all nodes
    d3.selectAll('svg .node')
      .attr('d', function(d) {
        d.highlighted = false
      })
  }

  deselectAll = function() {
    var self = this
    d3.selectAll('svg .node').each(function(d) {
      if (d.highlighted) self.onClick(this, d)
    })
  }.bind(this)

  onClick = function (node, data) {
    d3.event.stopPropagation()
    this.emit('select', data, node)
    // d3.event.defaultPrevented returns true if the click event was fired by
    // a drag event. Prevents a click being registered upon drag release.
    if (data.rank === 'history' ||
        d3.event.defaultPrevented ||
        data.rank === 'elipsis') {
      return
    }
    if (data.highlighted) {
      data.wasHighlighted = data.highlighted
    } else {
      data.wasHighlighted = false
    }

    node.parentNode.appendChild(node)

    // @TODO this could be done using d3js and
    // modifying ".selected" from the nodes (.update()), no?

    this.resetAll()

    if (data.wasHighlighted) {
      data.highlighted = false
      this.emit('deselect')
    } else {
      if (data.rank === 'center') {
        // Enlarge the dial to match center node size
        this.svg.select('.dial')
          .transition('reset').duration(STYLES.nodeTransitionDuration)
          .attr('d', this.arcEnlarged)
      }

      // NODE signifies the node that we clicked on. We enlarge it.
      // Enlarge the node
      d3.select(node).selectAll('circle')
        .transition('grow').duration(STYLES.nodeTransitionDuration)
        .attr('r', STYLES.largeNodeSize / 2)
        .each((d) => {
          if (!d.img) {
            d3.select(node).select('.nodecircle')
              .transition('highlight').duration(STYLES.nodeTransitionDuration)
              .style('fill', theme.graph.enlargedNodeColor)
          }
        })

      // Enlarge the pattern of the node we clicked on
      d3.select(node).select('pattern')
        .transition('pattern').duration(STYLES.nodeTransitionDuration)
        .attr('x', -STYLES.largeNodeSize / 2)
        .attr('y', -STYLES.largeNodeSize / 2)

      // Enlarge the image of the node we clicked on
      // We also blur it a bit and darken it, so that the text displays better
      d3.select(node).select('image')
        .transition('image').duration(STYLES.nodeTransitionDuration)
        .attr('width', STYLES.largeNodeSize)
        .attr('height', STYLES.largeNodeSize)
        .style('filter', 'url(#darkblur)')

      // There is a slight bug when if you click
      // on nodes really quickly, the text
      // on some fails to disappear; needs further investigation

      // Fade in the description
      d3.select(node).selectAll('text')
        .transition('description').duration(STYLES.nodeTransitionDuration)
        .attr('opacity', 0.9)

      // Fade in the node name and make the text opaque
      d3.select(node).select('.nodetext')
        .transition('highlight').duration(STYLES.nodeTransitionDuration)
        .attr('dy', function (d) {
          if (d.description && d.type !== 'bitcoin') {
            if (d3.select(this.parentNode).classed('hasNodeIcon')) {
              return '.4em'
            }
            return '-.15em'
          } else {
            if (d3.select(this.parentNode).classed('hasNodeIcon')) {
              return (d.rank === 'center' ? '0.95em' : '.75em')
            }
            return '.35em'
          }
        })
        .attr('opacity', 1)

      // Move the icon up if description
      d3.select(node)
        .filter((d) => d.description)
        .select('.nodeIcon')
        .transition('highlight').duration(STYLES.nodeTransitionDuration)
        .attr('y', (d) => d.rank === 'center' ? -70 : -60)
      data.highlighted = true
    }
  }.bind(this)

  updateHistory = function (history) {
    if (typeof history !== 'undefined' && history.length > 0) {
      for (var j = history.length - 1, rank = 0;
           j >= 0;
           j--, rank++) {
        let alreadyExists = false
        for (let dataNode of this.dataNodes) {
          if (dataNode['uri'] === history[j]['uri']) {
            if (dataNode['rank'] === 'history') {
              alreadyExists = true
            }
          }
        }
        if (alreadyExists) { continue }

        history[j].connection = 'hist'
        history[j].rank = 'history'
        history[j].histLevel = rank

        if (rank === 0) {
          this.dataNodes.push(history[j])
          this.dataLinks.push({
            source: this.dataNodes[this.dataNodes.length - 1],
            target: this.dataNodes[0]
          })
        } else {
          this.dataNodes.push(history[j])
          this.dataLinks.push({
            source: this.dataNodes[this.dataNodes.length - 1],
            target: this.dataNodes[this.dataNodes.length - 2]
          })
        }
      }
      this.setUpVisibleNodes()
      this.d3update()
      this.resetAll()
      this.resetPos()
    }
    this.setUpVisibleNodes()
    this.d3update()
    this.resetAll()
    this.resetPos()
  }.bind(this)

  // Wraps the description of the nodes around the node.
  // http://bl.ocks.org/mbostock/7555321
  wrap = function (text, width, separator, joiner) {
    if (separator === undefined) {
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
      let tspan = text.text(null)
        .append('tspan')
        .attr('x', 0)
        .attr('y', y)
        .attr('dy', dy + 'em')

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
            .attr('dy',
            ((lineNumber === 0) ? (dy + 'em') : (lineHeight + 'em')))
            // ++lineNumber * lineHeight + dy + 'em')
            // NOTE(philipp): dy is relative to previous
            // sibling (== lineheight for all but first line)
            .text(word)
        }
      }
    })
    return hasWrapped
  }

  // Erases all the elements on the svg, but keeps the svg.
  // .background-layer must be the first element of this.svg,
  // and its first element must be .background-layer-links
  eraseGraph = function () {
    if (this.force) { this.force.stop() }
    this.svg
    .selectAll('.background-layer .background-layer-links *')
    .remove()
    this.svg
    .selectAll('.background-layer ~ *')
    .remove()
  }.bind(this)

  // Alternative to dragging the node to the center.
  // Does the same thing pretty much
  onDblClick = function (node, data) {
    if (this.mode !== 'preview') {
      this.emit('view-node', data, node)
    }
  }.bind(this)

  pulseCenter = function () {
    d3.select('.center-circle')
      .transition()
      .duration(1000)
      .attr('r', this.largeNodeSize * 0.57 * 1.5)
      .attr('opacity', 0.75)
      .transition()
      .duration(400)
      .attr('r', this.largeNodeSize * 0.57 * 1.1)
      .attr('opacity', 1)

    let instance = this

    setTimeout(function () {
      if (instance.isPulsing) {
        instance.pulseCenter()
      }
    }, 1400)
  }.bind(this)
  // Function called after deleting a node; render()
  // is not called after, so that we can do a smooth animation.
  deleteNodeAndRender = function (state) {
    let deletedNodeUri = d3.select(state.selected).datum().uri

    // Deletion animations

    d3.selectAll('.node').filter(function (d) {
      return d.uri === deletedNodeUri && d.rank === 'neighbour'
    })
      .select('pattern')
      .transition().duration(STYLES.nodeTransitionDuration / 3).delay(100)
      .attr('x', STYLES.largeNodeSize * 0.8)
      .attr('y', STYLES.largeNodeSize * 0.8)

    d3.selectAll('.node').filter(function (d) {
      return d.uri === deletedNodeUri && d.rank === 'neighbour'
    })
      .select('image')
      .transition().duration(STYLES.nodeTransitionDuration / 3).delay(100)
      .attr('width', STYLES.largeNodeSize * 0.8)
      .attr('height', STYLES.largeNodeSize * 0.8)

    d3.selectAll('.node').filter(function (d) {
      return d.uri === deletedNodeUri && d.rank === 'neighbour'
    })
      .select('circle')
      .transition().duration(STYLES.nodeTransitionDuration / 3).delay(100)
      .attr('r', STYLES.largeNodeSize / 2.2)
      .each(() => {
        for (var i = 1; i < this.dataNodes.length; i++) {
          if (this.dataNodes[i].uri === deletedNodeUri) {
            if (this.dataNodes[i].rank === 'neighbour') {
              this.dataNodes.splice(i, 1)
            }
          }
        }

        for (i = 0; i < this.dataLinks.length; i++) {
          if (this.dataLinks[i].source.uri === deletedNodeUri) {
            if (this.dataLinks[i].source.rank === 'neighbour') {
              this.dataLinks.splice(i, 1)
            }
          }
        }

        this.numberOfNeighbours--
        this.setUpVisibleNodes()
        this.d3update()
        this.resetAll()
        this.resetPos()

        // Once the animation is ended, we re-render everything
        // It updates the visibility of the radial
        // scrollbar and updates this.dataNodes etc

        // this.render(state)

        // Smooth radial scrolling
        // d3.select('.dial').transition()
        //  .duration(100)
        //  .call(this.arcTween, 2*Math.PI*
        // (this.numberOfNodes/this.numberOfNeighbours))
      })
  }

  updateAfterRotationIndex = function() {
    this.updateDial()
    if (this.visibleDataNodes) {
      this.setUpVisibleNodes()
      this.d3update()
      this.resetPos()
      this.resetAll(10)
      this.d3update()
    }
  }.bind(this)

  // Called from graph.jsx
  setRotationIndex = function (rotationIndex) {
    let prevRotationIndex = this.rotationIndex
    this.rotationIndex = rotationIndex || 0
    // @todo only execute updateAfterRot if index changed
    if ((prevRotationIndex !== this.rotationIndex) && !this.isPulsing) {
      this.updateAfterRotationIndex()
    }
  }.bind(this)

  onResize = function () {
    // Debounce
    clearTimeout(this.onResizeTimeoutId || -1)
    this.onResizeTimeoutId = setTimeout(function() {
      this.refreshDimensions()
      this.svg.attr('width', this.width).attr('height', this.height)
      this.drawBackground()
      this.updateAfterRotationIndex()
    }.bind(this), 25)
  }.bind(this)

  onScroll = function () {
    let rotationIndex = this.rotationIndex
    let numberOfNeighbours = this.numberOfNeighbours
    let MAX_VISIBLE = this.MAX_VISIBLE_NODES

    if (MAX_VISIBLE >= this.numberOfNeighbours) {
      return
    } else {
      if (d3.event.deltaY > 40) {
        if (rotationIndex < numberOfNeighbours - MAX_VISIBLE) {
          this.rotationIndex++
          this.emit('change-rotation-index',
          this.rotationIndex)
          this.updateAfterRotationIndex('up')
        }
      }
      if (d3.event.deltaY < 40) {
        if (rotationIndex > 0) {
          this.rotationIndex--
          this.emit('change-rotation-index',
          this.rotationIndex)
          this.updateAfterRotationIndex('down')
        }
      }
    }
  }.bind(this)
}
