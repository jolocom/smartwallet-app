// THIS FILE TAKES CARE OF DRAWING THE D3 GRAPH
// It is passed a state from the graph.jsx file, and then it draws
// the graph according to that state. The element itself is stateless.
// Currently I have issues with doing persistent changes here, for instance
// a moved node will not save upon refresh.

import d3 from 'd3'
import STYLES from 'styles/app'
import graphActions from '../actions/graph-actions'

export default class GraphD3 {

  constructor(el){
    this.el = el
    this.width = STYLES.width
    this.height = STYLES.height


    // We also have the this.force and this.svg being used in this file,
    // they are declared later.
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
      .charge(-12500)
      .linkDistance(STYLES.largeNodeSize * 0.5)
      .friction(0.8)
      .gravity(0.2)
      .size([this.width, this.height])
      .start()

    // We define our own drag functions, allow for greater controll over the way
    // it works
    this.node_drag = this.force.drag()
      .on("dragend", this.dragEnd)

  }.bind(this)



  // Creates the background svg and draws the gray circle
  drawBackground = function() {
    this.svg = d3.select(this.el).append('svg:svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('svg:g')

    this.svg.append('svg:rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'white')

    this.svg.append('svg:circle')
      .attr('cx', this.width * 0.5)
      .attr('cy', this.height * 0.5)
      .attr('r', STYLES.largeNodeSize* 0.57)
      .style('fill', STYLES.lightGrayColor)
  }.bind(this)



  drawNodes = function() {
    // These make the following statements shorter
    let largeNode = STYLES.largeNodeSize
    let smallNode = STYLES.smallNodeSize

    // We draw the lines for all the elements in the dataLinks array.
    let link =  this.svg.selectAll('line')
      .data(this.dataLinks, (d) => {return d.source.uri + '-' + d.target.uri})
      .enter()
      .insert('line', '.node')
      .attr('class','link')
      .attr('stroke-width', (d) => {
        // Capped at 13, found it to look the best
        return STYLES.width / 45 > 13 ? 13 : STYLES.width / 45})
      .attr('stroke', STYLES.lightGrayColor)

    // We draw a node for each element in the dataNodes array
    let node = this.svg.selectAll('.node')
      .data(this.dataNodes, (d) => {return d.uri})
      .enter()
      .append('g')
      .attr('class','node')
      .call(this.node_drag)

      // We need to use patterns in order to apply images to nodes
      let defs = node.append('svg:defs')
      defs.append('svg:pattern')
        .attr('id',  (d)=> d.uri)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('x', (d) => {
          return d.rank == 'center' ? -largeNode / 2 : -smallNode / 2})
        .attr('y', (d) => {
          return d.rank == 'center' ? -largeNode/ 2 : -smallNode / 2})
        .attr('patternUnits', 'userSpaceOnUse')
        .append('svg:image')
        .attr('xlink:href', (d) => d.img)
        .attr('width', (d) => {
          return d.rank == 'center' ? largeNode: smallNode})
        .attr('height', (d) => {
          return d.rank == 'center' ? largeNode: smallNode})

    let defsImages = node.append('svg:defs')
    defsImages.append('svg:pattern')
      .attr('id',  (d)=> d.uri)
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
        .attr('slope', 0.6)

    this.componentTransfer.append('feFuncG')
        .attr('type', 'linear')
        .attr('slope', 0.6)

    this.componentTransfer.append('feFuncB')
        .attr('type', 'linear')
        .attr('slope', 0.6)

    node.append('circle')
      .attr('r', (d) => {
        return d.rank == 'center' ? largeNode / 2 : smallNode / 2 })
      .style('fill', (d) => {
        return d.img ? 'url(#'+d.uri+')' : STYLES.blueColor })
      .attr('stroke',STYLES.grayColor)
      .attr('stroke-width',2)

    // The name of the person, displays on the node
    node.append('svg:text')
      .attr('class', 'nodetext')
      .style('fill', '#e6e6e6')
      .attr('text-anchor', 'middle')
      .attr('opacity',(d) => {
        return d.img ? 0 : 1})
      .attr('dy', '.35em')
      .style('font-weight', 'bold')
      // In case the rdf card contains no name
      .text((d) => {return d.name ? d.name : 'Anonymous'})

     // The text description of a person
     node.append('svg:text')
    .attr('class', 'nodedescription')
    .style('fill', '#e6e6e6')
    .attr('text-anchor', 'middle')
    .attr('opacity', 0)
    .attr('dy', 0)
    .style('font-size', '80%')
    .text(function (d) {
      // In case the person has no description available.
      if (d.description) {
        if(d.description.length>50) return (d.description.substring(0, 50)+'...')
        else return d.description
      }
    })
    // This wraps the description nicely.
    .call(this.wrap, STYLES.largeNodeSize * 0.7, '', '')

    // Subscribe to the click listeners
    node.on('click', this.onClick)
    node.on('dblclick', this.onDblClick)
    this.force.on('tick', this.tick)
  }.bind(this)



  // This function fires upon tick, around 30 times per second?
  tick = function(){
    // Update the link positions.
    d3.selectAll('.link').attr('x1', (d) => {return d.source.rank =='center' ? STYLES.width/2 : d.source.x})
      .attr('y1', (d) => {return d.source.rank =='center' ? STYLES.height/2 : d.source.y})
      .attr('x2', (d) => {return d.target.rank =='center' ? STYLES.width/2 : d.target.x})
      .attr('y2', (d) => {return d.target.rank =='center' ? STYLES.height/2 : d.target.y})
    // Update the node positions. We use translate because we are working with
    // a group of elements rather than just one.
    d3.selectAll('g .node').attr('transform', function(d) {
      if (d.rank == 'center') {
        d.x = STYLES.width / 2
        d.y = STYLES.height / 2
      }
      return 'translate(' + d.x + ',' + d.y + ')'
    })
  }.bind(this)

  // We check if the node is dropped in the center, if yes we navigate to it.
  // We also prevent the node from bouncing away in case it's dropped to the middle

  dragEnd = function(node, i) {
    this.force.stop()
    if (node.rank == 'center') {
      // In here we would have the functionality that opens the node's card
    } else if (node.rank =='adjacent') {
      // We check if the node is dropped on top of the middle node, if yes
      // We change the perspective
      let w = STYLES.width
      let h = STYLES.height
      let size = STYLES.largeNodeSize
      let x =  node.x > w / 2 - size / 2 && node.x < w / 2 + size / 2
      let y =  node.y > h / 2 - size / 2 && node.y < h / 2 + size / 2

      // If in the area we navigate to the node, otherwise we start the force
      // layout back
      if (x && y)  graphActions.navigateToNode(node)
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
  onClick = function(node) {
    // d3.event.defaultPrevented returns true if the click event was fired by
    // a drag event. Prevents a click being registered upon drag release.
    if (d3.event.defaultPrevented) {
      return
    }

    let smallSize = STYLES.smallNodeSize
    let largeSize = STYLES.largeNodeSize

    // We set all the circles back to their normal sizes
    d3.selectAll('g .node').selectAll('circle')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('r', (d) => {
        return d.rank == 'center' ? largeSize / 2 : smallSize / 2 })

    // Setting all the pattern sizes back to normal.
    d3.selectAll('g .node').selectAll('pattern')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('x', (d) => {
        return d.rank == 'center' ? -largeSize / 2 : -smallSize / 2 })
      .attr('y', (d) => {
        return d.rank == 'center' ? -largeSize / 2 : -smallSize / 2 })

    // Setting all the image sizes back to normal
    d3.selectAll('g .node').selectAll('image')
    .transition().duration(STYLES.nodeTransitionDuration)
    .attr('width', (d) => {
      return d.rank == 'center' ? largeSize : smallSize
    })
    .attr('height',(d) => {
      return d.rank == 'center' ? largeSize : smallSize
    })
    .style('filter', null)

    // We set the name of the node to invisible in case it has a profile picture
    // In case the node has no picture, we display it's name.
    d3.selectAll('g .node').selectAll('.nodetext')
    .attr('opacity', (d) => {
      return d.img ? 0 : 1})
    .attr('dy', '.35em')
    // We set the node description to be invisible
    d3.selectAll('g .node').selectAll('.nodedescription')
      .attr('opacity', 0)

    // NODE signifies the node that we clicked on. We enlarge it
    d3.select(this).select('circle')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('r', STYLES.largeNodeSize / 2)

    // We enlarge the pattern of the node we clicked on
    d3.select(this).select('pattern')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('x', -STYLES.largeNodeSize / 2)
      .attr('y', -STYLES.largeNodeSize / 2)

    // We enlarge the image of the node we clicked on
    // We also blur it a bit and darken it, so that the text displays better
    d3.select(this).select('image')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('width', STYLES.largeNodeSize)
      .attr('height', STYLES.largeNodeSize)
      .style('filter', 'url(#darkblur)')

    // Tere is a slight bug when if you click on nodes really quickly, the text
    // on some fails to dissapear, needs further investigation

    // We fade in the description
    d3.select(this).selectAll('text')
    .transition().duration(STYLES.nodeTransitionDuration)
    .attr('opacity', 0.9)

    // We fade in the node name and make the text opaque
    d3.select(this).select('.nodetext')
    .transition().duration(STYLES.nodeTransitionDuration)
    .attr('dy', -20)
    .attr('opacity', 1)
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
    this.force.stop()
    this.svg.selectAll('*').remove()
  }.bind(this)


  // Alternative to dragging the node to the center. Does the same thing pretty much
  onDblClick = function(node) {
    if (node.rank == 'center'){
    } else {
      graphActions.navigateToNode(node)
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
