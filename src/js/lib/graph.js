// THIS FILE TAKES CARE OF DRAWING THE D3 GRAPH
// It is passed a state from the graph.jsx file, and then it draws
// the graph according to that state. The element itself is stateless.
// Currently I have issues with doing persistent changes here, for instance
// a moved node will not save upon refresh.
import d3 from 'd3'
import STYLES from 'styles/app'
import {EventEmitter} from 'events'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import JolocomTheme from 'styles/jolocom-theme'

const theme = getMuiTheme(JolocomTheme)

console.log(theme)

export default class GraphD3 extends EventEmitter {

  constructor(el) {
    super()
    this.el = el
    this.rendered = false

    // A bit of code duplication here.
    this.width = this.el.offsetWidth || STYLES.width
    this.height = this.el.offsetHeight || STYLES.height

    this.svg = d3.select(this.el).append('svg:svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('svg:g')

    this.svg.append('svg:rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'white')
  }

  render = function(nodes) {
    if (this.rendered) {
      this.eraseGraph()
    }

    this.calcDimensions()
    this.setUpForce(nodes)
    this.drawBackground()
    this.drawNodes()
    this.rendered = true
  }

  calcDimensions = function() {
    this.width = this.el.offsetWidth || STYLES.width
    this.height = this.el.offsetHeight || STYLES.height

    this.smallNodeSize = STYLES.smallNodeSize
    this.largeNodeSize = STYLES.largeNodeSize
  }

   // Starts the force simulation.
  setUpForce = function(nodes){
  // Upon set up force we also initialize the dataLinks and dataNodes
  // variables.
    this.dataNodes = [nodes.center]
    this.dataLinks = []

  // Flatten the center and neighbour nodes we get from the state
    for (var i = 0; i < nodes.neighbours.length; i++) {
      this.dataNodes.push(nodes.neighbours[i])
      this.dataLinks.push({'source': i + 1, 'target':0})
    }
    // now the nodes are there, we can initialize
    // Then we initialize the simulation, the force itself.
    this.force = d3.layout.force()
      .nodes(this.dataNodes)
      .links(this.dataLinks)
      .charge(-1000)
      .chargeDistance(STYLES.largeNodeSize*2)
      .linkDistance((d, i)=> {

        if(d.rank == 'history' && d.histLevel>0) return STYLES.smallNodeSize * 1.25
        else if(d.rank == 'history' || i<12) return STYLES.largeNodeSize * 1.25
        else if (i>38) {
          return STYLES.largeNodeSize * 2.5
        }
        else return STYLES.largeNodeSize * 2

      })
      .size([this.width, this.height])
      .start()
    // We define our own drag functions, allow for greater controll over the way
    // it works
    this.node_drag = this.force.drag()
      .on('dragend', this.dragEnd)
  }.bind(this)

  // Draws the dark gray circle behind the main node.
  drawBackground = function() {
    this.svg.append('svg:circle')
      .attr('cx', this.width * 0.5)
      .attr('cy', this.height * 0.5)
      .attr('r', this.largeNodeSize* 0.57)
      .style('fill', STYLES.lightGrayColor)
  }.bind(this)

  // Draws the nodes
  drawNodes = function() {
    let self = this
    // These make the following statements shorter
    let largeNode = this.largeNodeSize
    let smallNode = this.smallNodeSize


    let defsFull = this.svg.append('svg:defs')
    defsFull.append('svg:pattern')
    .attr('id',  'full')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('x', (STYLES.largeNodeSize/STYLES.fullScreenButtonPosition)-STYLES.fullScreenButton/2)
    .attr('y', -(STYLES.largeNodeSize/STYLES.fullScreenButtonPosition)-STYLES.fullScreenButton/2)
    .attr('patternUnits', 'userSpaceOnUse')
    .append('svg:image')
    .attr('xlink:href', 'img/full.jpg' )
    .attr('width', STYLES.fullScreenButton)
    .attr('height', STYLES.fullScreenButton)


    // We draw the lines for all the elements in the dataLinks array.
    let link = this.svg.selectAll('line')
    .data(this.dataLinks, (d, i) => {return d.source.uri + i + '-' + d.target.uri + i})
    .enter()
    .insert('line', '.node')
    .attr('class','link')
    .attr('stroke-width', () => {
      // Capped at 13, found it to look the best
      return this.width / 45 > 13 ? 13 : this.width / 45})
      .attr('stroke', STYLES.lightGrayColor)

    // We draw a node for each element in the dataNodes array
    this.node = this.svg.selectAll('.node')
      .data(this.dataNodes, (d, i) => {return (d.uri + i)})
      .enter()
      .append('g')
      .attr('class','node')
      .call(this.node_drag)

    let defsImages = this.node.append('svg:defs')
    defsImages.append('svg:pattern')
      .attr('id',  (d)=> d.uri)
      .attr('class', 'image')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', (d) => {
        return d.rank == 'center' ? -largeNode / 2 : -smallNode / 2})
      .attr('y', (d) => {
        return d.rank == 'center' ? -largeNode / 2 : -smallNode / 2})
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', (d) => d.img)
      .attr('width', (d) => {
        return d.rank == 'center' ? largeNode : smallNode})
      .attr('height', (d) => {
        return d.rank == 'center' ? largeNode : smallNode})
      .attr( 'preserveAspectRatio','xMinYMin slice')

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
      .attr('stdDeviation', 1.5)
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
        if(d.rank == 'center')
          return largeNode / 2
        else if (d.rank == 'history') {
          return smallNode / 3
        }
        else return smallNode / 2 })
      .style('fill', (d) => {
        if(d.img && d.rank!='history') return 'url(#'+d.uri+')'
        else{
          if( d.rank  == 'history'){
            return STYLES.grayColor
          } else if( d.rank == 'unavailable') {
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
      .attr('opacity',(d) => {
        if (d.img && d.rank!='history') return 0
        else return 1
      })
      .attr('dy', '.35em')
      .attr('font-size', (d) => d.rank == 'history' ? STYLES.largeNodeSize/12 : STYLES.largeNodeSize/8)
      .style('font-weight', 'bold')
      // In case the rdf card contains no name
      .text((d) => {
        if(d.name)
        {
          // ATM we only display the first name, this way it fits on the screen.
          // This is needlessly complicated. Think about a fix.
          if(d.name.indexOf(' ')>0){
            let name = d.name.substring(0, d.name.indexOf(' '))
            if(name.length > 10)
              return name.substring(0, 10)
            else return name
          }
          else if(d.name.length > 10)
            return d.name.substring(0, 10)
          else return d.name
        }

        else if (d.title) {
          if(d.title.length> 10) return d.title.substring(0, 10) + '...'
          else return d.title
        } else {
          if(d.uri.search('profile')>0){
            let x = d.uri.search('profile')
            let name = d.uri.substring(0, x-1)
            name = name.substring(name.lastIndexOf('/')+1, name.length)
            if(name.length>10) return name.substring(0, 10)+'...'
            else return name
          }
          else return 'Not Found'
        }
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
        if(d.description.length>45) return (d.description.substring(0, 45)+'...')
        else return d.description
      }
    })
    // This wraps the description nicely.
    .call(this.wrap, STYLES.largeNodeSize * 0.75, ' ', ' ')

    let full = this.node.append('circle')
     .attr('class', 'nodefullscreen')
     .attr('r', 0 )
     .style('fill', 'url(#full)')
     .attr('cy', -STYLES.largeNodeSize / STYLES.fullScreenButtonPosition)
     .attr('cx', STYLES.largeNodeSize / STYLES.fullScreenButtonPosition)
     .style('filter', 'url(#drop-shadow)')

    // Subscribe to the click listeners
    this.node.on('click', function(data){
      self.onClick(this,data)
    })
    this.node.on('dblclick', this.onDblClick)

    full.on('click', function(data) {
      self.onClickFull(this, data)
    })

    this.force.on('tick', this.tick)
  }.bind(this)

  // This function fires upon tick, around 30 times per second?
  tick = function(e){
    let center = {y:(this.height / 2), x: this.width /2}
    let k = 2.5 * e.alpha
    d3.selectAll('g .node').attr('d', function(d){
      if(d.rank=='center'){
        d.x=center.x
        d.y=center.y
      }
      else if (d.rank=='history'){
        d.x += (center.x-d.x)*k
        if(d.histLevel==0){
          d.y += (center.y-d.y+STYLES.largeNodeSize*(d.histLevel+1))*k
        }
        else d.y += (center.y-d.y+STYLES.smallNodeSize*(d.histLevel+1))*k
      }
    })

    // Update the link positions.
    d3.selectAll('.link')
      .attr('x1', (d) =>  d.source.x )
      .attr('y1', (d) =>  d.source.y )
      .attr('x2', (d) =>  d.target.x )
      .attr('y2', (d) =>  d.target.y )
    // Update the node positions. We use translate because we are working with
    // a group of elements rather than just one.
    d3.selectAll('g .node').attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
  }.bind(this)

  // We check if the node is dropped in the center, if yes we navigate to it.
  // We also prevent the node from bouncing away in case it's dropped to the middle
  dragEnd = function(node) {
    this.force.stop()
    if (node.rank == 'center' || node.rank == 'unavailable') {
      this.force.start()
      // In here we would have the functionality that opens the node's card
    } else if (node.rank =='adjacent' || node.rank =='history' ) {
      // We check if the node is dropped on top of the middle node, if yes
      // We change the perspective
      let w = this.width
      let h = this.height
      let size = STYLES.largeNodeSize
      let x =  node.x > w / 2 - size / 2 && node.x < w / 2 + size / 2
      let y =  node.y > h / 2 - size / 2 && node.y < h / 2 + size / 2

      // If in the area we navigate to the node, otherwise we start the force
      // layout back
      if (x && y)  {
        this.emit('center-changed', node)
      }
      else this.force.start()
    }
  }.bind(this)

  // This basically pushes a node to the dataNodes and a link to the dataLinks
  // Arrays. Then tells d3 to draw a node for each of those.
  addNode = function(node){
    this.force.stop()
    this.dataNodes.push(node)
    this.dataLinks.push({source: this.dataNodes.length - 1, target: 0})
    this.drawNodes()
    this.force.start()
  }.bind(this)

  // Enlarges and displays extra info about the clicked node, while setting
  // all other highlighted nodes back to their normal size
  onClickFull = function(node, data) {
    //stops propagation to node click handler
    this.emit('view-node', data)
    d3.event.stopPropagation()
  }

  onClick = function(node, data) {
    // d3.event.defaultPrevented returns true if the click event was fired by
    // a drag event. Prevents a click being registered upon drag release.
    if(data.rank == 'history') return
    if (d3.event.defaultPrevented) {
      return
    }

    this.emit('select', data)
    let smallSize = STYLES.smallNodeSize
    let largeSize = STYLES.largeNodeSize

    data.wasHighlighted = data.highlighted
    // We set all the circles back to their normal sizes
    d3.selectAll('g .node').filter(function(d) { return d.highlighted }).selectAll('.nodecircle')
      .transition('reset').duration(STYLES.nodeTransitionDuration)
      .attr('r', (d) => {
        return d.rank == 'center' ? largeSize / 2 : smallSize / 2
      })
      .attr('opacity', (d) => (d.rank == 'history' && d.img) ? 0.5 : 1)

    // Setting all the pattern sizes back to normal.
    d3.selectAll('g .node').filter(function(d) { return d.highlighted }).selectAll('pattern')
      .transition('patern').duration(STYLES.nodeTransitionDuration)
      .attr('x', (d) => {
        return d.rank == 'center' ? -largeSize / 2 : -smallSize / 2 })
      .attr('y', (d) => {
        return d.rank == 'center' ? -largeSize / 2 : -smallSize / 2 })

    // Setting all the image sizes back to normal
    d3.selectAll('g .node').filter(function(d) { return d.highlighted }).selectAll('image')
      .transition('image').duration(STYLES.nodeTransitionDuration)
      .attr('width', (d) => {
        return d.rank == 'center' ? largeSize : smallSize
      })
      .attr('height',(d) => {
        return d.rank == 'center' ? largeSize : smallSize
      })
      .style('filter', null)

    // We set the name of the node to invisible in case it has a profile picture
    // In case the node has no picture, we display it's name.
    d3.selectAll('g .node').filter(function(d) { return d.highlighted }).selectAll('.nodetext')
      .transition('reset').duration(STYLES.nodeTransitionDuration)
      .attr('dy', '.35em')
      .attr('opacity', (d) => {
        return d.img ? 0 : 1})


    // We set the node description to be invisible
    d3.selectAll('g .node').filter(function(d) { return d.highlighted }).selectAll('.nodedescription')
      .transition('description').duration(STYLES.nodeTransitionDuration)
      .attr('opacity', 0)

    //We make the fullscreen button smaller
    d3.selectAll('g .node').filter(function(d) { return d.highlighted }).selectAll('.nodefullscreen')
      .transition('reset').duration(STYLES.nodeTransitionDuration)
      .attr('r', 0 )

    d3.selectAll('g .node')
      .attr('d', (d) => d.highlighted = false )

    if(data.wasHighlighted)
    {
      data.highlighted = false
      this.emit('deselect')
    }
    else{
    // NODE signifies the node that we clicked on. We enlarge it
      d3.select(node).select('circle')
        .transition('highlight').duration(STYLES.nodeTransitionDuration)
        .attr('r', STYLES.largeNodeSize / 2)
        .attr('opacity', 1)

      // We enlarge the pattern of the node we clicked on
      d3.select(node).select('pattern')
        .transition('pattern').duration(STYLES.nodeTransitionDuration)
        .attr('x', -STYLES.largeNodeSize / 2)
        .attr('y', -STYLES.largeNodeSize / 2)

      d3.select(node).select('.nodefullscreen')
        .transition('highlight').duration(STYLES.nodeTransitionDuration)
        .attr('r', STYLES.fullScreenButton/2 )

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

  updateHistory(history) {
    if(history.length>0){
      this.force.stop()
      for (var i = 0; i < history.length; i++) {
        history[history.length-1-i].rank = 'history'
        history[history.length-1-i].histLevel = i
        if (i == 0) {

          this.dataNodes.push(history[history.length-1-i])
          this.dataLinks.push({source: this.dataNodes.length - 1, target: 0})
        }
        else{
          this.dataNodes.push(history[history.length-1-i])
          this.dataLinks.push({source: this.dataNodes.length - 1, target: this.dataNodes.length - 2})
        }
      }
      this.drawNodes()
      this.force.start()
    }

  }

  // Wraps the description of the nodes around the node.
  // http://bl.ocks.org/mbostock/7555321
  wrap = function(text, width, separator, joiner) {
    if(separator == undefined){
      separator = /\s+/
      joiner = ' '
    }
    let hasWrapped = []
    text.each(function() {
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
            .attr('dy', ((lineNumber==0)?(dy+'em'):(lineHeight+'em'))) //++lineNumber * lineHeight + dy + 'em') NOTE(philipp): dy is relative to previous sibling (== lineheight for all but first line)
            .text(word)
        }
      }
    })
    return hasWrapped
  }

  // Erases all the elements on the svg, but keeps the svg.
  eraseGraph = function(){
    if(this.force) this.force.stop()
    this.svg.selectAll('*').remove()
  }.bind(this)

  // Alternative to dragging the node to the center. Does the same thing pretty much
  onDblClick = function(node) {
    if (node.rank != 'center'){
      this.emit('center-changed', node)
    }
  }.bind(this)

  // This is not implemented apparently.
  onResize = function() {
    this.setSize()
  }.bind(this)

  // Not yet implemented.
  setSize = function() {
    this.width = this.el.offsetWidth
    this.height = this.el.offsetHeight
    this.svg.attr('width', this.width).attr('height', this.height)
  }.bind(this)
}
