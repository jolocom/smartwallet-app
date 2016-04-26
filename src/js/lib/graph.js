// THIS FILE TAKES CARE OF DRAWING THE D3 GRAPH
// It is passed a state from the graph.jsx file, and then it draws
// the graph according to that state. The element itself is stateless.
// Currently I have issues with doing persistent changes here, for instance
// a moved node will not save upon refresh.

import d3 from 'd3'
import STYLES from 'styles/app'

export default class GraphD3 {

  constructor(el, state, handleClick){
    console.log(state, 'this is what I use to draw')
    this.el = el
    this.handleNodeClick = handleClick
    this.onNodeClick = this.onNodeClick.bind(this)

    this.width = STYLES.width
    this.height = STYLES.height

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
      .attr('r', this.width / 6)
      .style('fill', STYLES.lightGrayColor)

    this.drawGraph(state)
  }

  drawGraph(state){
    // Takes care of node dragging.
    let drag = d3.behavior.drag()
      .on('drag', this.dragMove)

    // Draw the lines first, this way they are in the background
    this.svg.selectAll('connections')
      .data(state.neighbours)
      .enter()
      .append('line')
      .attr('id', (d) => {return d.name})
      .attr('x1', (d) => {return d.x})
      .attr('y1', (d) => {return d.y})
      .attr('x2', this.width / 2)
      .attr('y2', this.height / 2)
        .style('stroke-width', this.width / 60)
        .style('stroke', STYLES.lightGrayColor)
        .style('fill', 'none')

    // Wraps the center object in an array so that d3 can work with it
    let centerWork = [state.center]
    // Draw the center node node
    let center = this.svg.selectAll('center_node')
      .data(centerWork)
      .enter()
      .append('circle')
      .attr('class', 'center')
      .attr('cx', this.width / 2)
      .attr('cy', this.height / 2)
      .attr('r', STYLES.largeNodeSize/2)
      .attr('width', STYLES.largeNodeSize)
      .attr('height', STYLES.largeNodeSize)
      .style('fill', STYLES.grayColor)
      .style('stroke','white')
      .style('stroke-width', 0)

<<<<<<< HEAD
    // `base` only needs to run once
    this.force = d3.layout.force()
    this.force
      .nodes(state.nodes)
      .links(state.links)
      .gravity(0.2)
      .charge(STYLES.width * -14)
      .linkDistance(STYLES.width / 3)
      .size([this.w, this.h])
      .start()


    //group links (so they don't overlap nodes)
    svg.append('g').attr('class', 'link_group')
  }

  // Invoked in 'componentDidUpdate' of react graph
  update(prevState, state) {
    let self = this
    let svg = d3.select(this.el).select('svg').select('g')

    this.force
      .nodes(state.nodes)
      .links(state.links)
      .start()

    // --------------------------------------------------------------------------------
    // links

    // data binding
    let linkGroup = d3.select(this.el).select('svg').select('g.link_group')
    linkGroup.selectAll('g.link').remove() // remove old links entirely
    let link = linkGroup.selectAll('g.link')
      .data(state.links, (d) => {
        // this retains link-IDs over changing target/source direction
        // NB: not really useful in our case
        let first = Util.stringMin(d.source.uri, d.target.uri)
        let last = Util.stringMax(d.source.uri, d.target.uri)
        return first + last
      })

    // only new links
    let linkNew = link.enter()
      .append('svg:g').attr('class', 'link')
      .call(this.force.drag)

    console.log('NEW LINKS', linkNew[0].length)

    // add line
    linkNew.append('svg:line')
      .attr('class', 'link')
      .attr('stroke-width', STYLES.width / 45)
      .attr('stroke', STYLES.lightGrayColor)
      .attr('x1', (d) => d.x1)
      .attr('y1', (d) => d.y1)
      .attr('x2', (d) => d.x1)
      .attr('y2', (d) => d.y2)

    // remove old links
    let linkOld = link.exit()
    console.log('OLD LINKS', linkOld[0].length)
    linkOld.transition().duration(2000).style('opacity', 0).remove()

    // --------------------------------------------------------------------------------
    // nodes

    let node = svg.selectAll('g.node')
      .data(state.nodes, (d) => d.uri)

    let defs = node.enter().append('svg:defs')
    defs.append('svg:pattern')
      .attr('id',  (d, i)=>'avatar'+i)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', -STYLES.largeNodeSize / 2)
      .attr('y', -STYLES.largeNodeSize / 2)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', (d) => d.img)
      .attr('width', STYLES.largeNodeSize)
      .attr('height', STYLES.largeNodeSize)
      .attr('x', 0)
      .attr('y', 0)

    let nodeNew = node.enter().append('svg:g')
      .attr('class', 'node')
      .attr('dx', '80px')
      .attr('dy', '80px')
      .call(this.force.drag)

    nodeNew.style('opacity', 0)
      .transition()
      .style('opacity', 1)

    console.log('NEW NODES', nodeNew[0].length)

    // add circle
    nodeNew.filter((d) => d.type == 'uri')
      .append('svg:circle')
=======
    center.on('click', (d) => {
      this.onNodeClick(d)
    })
    // Drawing the neighbour nodes.
    this.svg.selectAll('neighbour_node')
      .data(state.neighbours)
      .enter()
      .append('circle')
>>>>>>> feature/#71-rewriting-rdf-functionality
      .attr('class', 'node')
      .attr('cx', (d) => { return d.x })
      .attr('cy', (d) => { return d.y })
      .attr('r', STYLES.smallNodeSize / 2)
      .attr('width', STYLES.smallNodeSize)
      .attr('height', STYLES.smallNodeSize)
<<<<<<< HEAD
      .style('fill', (d, i) => {
        if (d.img!='') {
          return 'url(#avatar'+i+')'}
        else {
          if (d.nodeType === 'sensor') {
            return this.getSensorColor(d.title)
          }
          return STYLES.grayColor
        }
      })
      .style('stroke', 'white')
=======
      .style('fill', STYLES.grayColor)
      .style('stroke','white')
>>>>>>> feature/#71-rewriting-rdf-functionality
      .style('stroke-width', 0)
      .call(drag)
  }

  update(newState){
    this.drawGraph(newState)
  }

  onNodeClick(d){
    this.handleNodeClick(d)
  }

  onResize() {
    this.setSize()
  }

  setSize() {
    this.width = this.el.offsetWidth
    this.height = this.el.offsetHeight
    this.svg.attr('width', this.width).attr('height', this.height)
  }

<<<<<<< HEAD
  changeCenter(domNodes, oldCenter, newCenter, historyNodes){
    newCenter.node.fixed = true
    if (!oldCenter) {
      //initialization- no transition needed
      this.animateNode(newCenter.node,
                   STYLES.width / 2,
                   STYLES.height / 2)

      this.getDomNode(domNodes, newCenter)
        .select('circle')
        .style('fill', function(d, i){
          if (d.img) { return 'url(#avatar'+i+')'}
          else { return STYLES.blueColor }
        })
      return
    }

    if (oldCenter.node != newCenter.node) {
      // update center perspective
      { // treat old center & update node history
        let oldCenterDom = this.getDomNode(domNodes, oldCenter)

        oldCenterDom
          .select('circle')
          .style('fill', function(d, i){
            if (d.img!='') {
              return 'url(#avatar'+i+')'}
            else {
              return STYLES.lightBlueColor
            }
          })

        this.animateNode(oldCenter.node,
                     STYLES.width / 2,
                     STYLES.height * 4/5)

        if(historyNodes.length > 1){
          let historic = historyNodes[historyNodes.length - 2]
          if (historic.node != newCenter.node)
            historic.node.fixed = false

          let historicDom = this.getDomNode(domNodes, historic)
          historicDom
            .select('circle')
            .style('fill', function(d, i){
              if (d.img!='') {
                return 'url(#avatar'+i+')'}
              else {
                return STYLES.grayColor
              }
            })
        }
      }
      {
        let newCenterDom = this.getDomNode(domNodes, newCenter)
        this.animateNode(newCenter.node,
                     STYLES.width / 2,
                     STYLES.height / 2) // move to center
        newCenterDom
          .select('circle')
          .style('fill', function(d, i){
            if (d.img!='') {
              return 'url(#avatar'+i+')'}
            else {
              return STYLES.blueColor
            }
          })
      }
    }
  }

  getDomNode(allNodes, node) {
    return allNodes.filter((d) => d.uri == node.uri)
  }

  // http://bl.ocks.org/mbostock/7555321
  wrap(text, width, separator, joiner) {
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
      let lineHeight = 1.1 // ems
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

  disablePreview(allNodes){
    // resets ALL nodes
    allNodes.select('circle')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('r', STYLES.smallNodeSize / 2)
      .style('stroke-width', 0)
    allNodes.select('.nodetext')
      .transition().duration(STYLES.nodeTransitionDuration)
      .style('opacity', 1)
    allNodes.selectAll('g.extras')
      .transition().duration(STYLES.nodeTransitionDuration)
      .style('opacity', 0)
      .remove()
  }

  enablePreview(node){
    node.moveToFront()

    node
      .select('circle') // only current circle
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('r', STYLES.largeNodeSize / 2)
      .style({ 'stroke': 'white',
               'stroke-width': STYLES.width / 100 })
    node.select('.nodetext')
      .transition().duration(STYLES.nodeTransitionDuration)
      .style('opacity', 0)
    let extras = node.append('svg:g')
      .attr('class', 'extras')
      .style('opacity', 0)
    extras
      .append('svg:text')
      .attr('class', 'preview-title')
      .attr('text-anchor', 'middle')
      .attr('dy', -1.5) //(STYLES.largeNodeSize / - 6)) //(STYLES.largeNodeSize / 18))
      .text((d) => d.title)
      .call(this.wrap, STYLES.largeNodeSize * 0.7, '', '')
    extras
      .append('svg:text')
      .attr('class', 'preview-description')
      .attr('text-anchor', 'middle')
      .attr('dy', 1)
      .text((d) => d.description)
      .call(this.wrap, STYLES.largeNodeSize * 0.75)
    extras
      .transition().duration(STYLES.nodeTransitionDuration)
      .style('opacity', 1)
    return node
=======
// Moves the node and the edge attached to it upon mouse drag
  dragMove(d){
    d3.select(this).attr('cx', d3.event.x)
    d3.select(this).attr('cy', d3.event.y)
    d3.select('#'+d.name).attr('x1', d3.event.x)
    d3.select('#'+d.name).attr('y1', d3.event.y)
>>>>>>> feature/#71-rewriting-rdf-functionality
  }
}
