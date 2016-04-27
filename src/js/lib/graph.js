// THIS FILE TAKES CARE OF DRAWING THE D3 GRAPH
// It is passed a state from the graph.jsx file, and then it draws
// the graph according to that state. The element itself is stateless.
// Currently I have issues with doing persistent changes here, for instance
// a moved node will not save upon refresh.

import d3 from 'd3'
import STYLES from 'styles/app'

export default class GraphD3 {

  constructor(el, state, handleClick){
    this.el = el
    this.handleNodeClick = handleClick
    this.onNodeClick = this.onNodeClick.bind(this)


    let links = []
    let nodes = [state.center]

    // Flatten the center and neighbour nodes we get from the state
    for (var i = 0; i < state.neighbours.length; i++) {
      nodes.push(state.neighbours[i])
      links.push({'source': i + 1, 'target':0})
    }

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

    let force = d3.layout.force()
            .nodes(nodes)
            .links(links)
            .charge(-15000)
            .friction(0.8)
            .gravity(0.2)
            .size([this.width, this.height])
            .start()

    let link =  this.svg.selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('class','link')
            .attr('stroke-width', STYLES.width / 45)
            .attr('stroke', STYLES.lightGrayColor)

    let node = this.svg.selectAll('.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class','node')
            .call(force.drag)

    let defs = node.append('svg:defs')
    defs.append('svg:pattern')
      .attr('id',  (d)=> d.name)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', function(d){
        if (d.rank == 'center') return -STYLES.largeNodeSize / 2
        else return -STYLES.smallNodeSize / 2
      })
      .attr('y', function(d){
        if (d.rank == 'center') return -STYLES.largeNodeSize / 2
        else return -STYLES.smallNodeSize / 2
      })
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', (d) => d.img)
      .attr('width', function(d){
        if (d.rank == 'center') return STYLES.largeNodeSize
        else return STYLES.smallNodeSize
      })
      .attr('height',function(d){
        if (d.rank == 'center') return STYLES.largeNodeSize
        else return STYLES.smallNodeSize
      })
      .attr('x', 0)
      .attr('y', 0)

    node.append('circle')
        .attr('r', function(d){
          if (d.rank == 'center') return STYLES.largeNodeSize / 2
          else return STYLES.smallNodeSize / 2
        })
        .style('fill', function(d){
          if (d.img) {   return 'url(#'+d.name+')'}
          else { return STYLES.blueColor }
        })
        .attr('stroke',STYLES.grayColor)
        .attr('stroke-width',2)

    node.on('click', function(){


      d3.selectAll('g .node').selectAll('circle')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('r', function(d){
        if (d.type == 'center') return STYLES.largeNodeSize / 2
        else return STYLES.smallNodeSize / 2
      })

      d3.selectAll('g .node').selectAll('pattern')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('x', function(d){
        if (d.type == 'center') return -STYLES.largeNodeSize / 2
        else return -STYLES.smallNodeSize / 2
      })
      .attr('y', function(d){
        if (d.type == 'center') return -STYLES.largeNodeSize / 2
        else return -STYLES.smallNodeSize / 2
      })

      d3.selectAll('g .node').selectAll('image')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('width', function(d){
        if (d.type == 'center') return STYLES.largeNodeSize
        else return STYLES.smallNodeSize
      })
      .attr('height',function(d){
        if (d.type == 'center') return STYLES.largeNodeSize
        else return STYLES.smallNodeSize
      })

      d3.select(this).select('circle')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('r', STYLES.largeNodeSize / 2)

      d3.select(this).select('pattern')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('x', -STYLES.largeNodeSize / 2)
      .attr('y', -STYLES.largeNodeSize / 2)

      d3.select(this).select('image')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('width', STYLES.largeNodeSize)
      .attr('height', STYLES.largeNodeSize)

    })

    force.on('tick', function() {
      link.attr('x1', function(d) {
        if (d.source.type == 'center') {
          return (STYLES.width / 2)
        }
        else {
          return d.source.x
        }
      })
        .attr('y1', function(d) {
          if (d.source.type == 'center') {
            return (STYLES.height / 2)
          }
          else {
            return d.source.y
          }
        })
        .attr('x2', function(d) {
          if (d.target.type == 'center') {
            return (STYLES.width / 2)
          }
          else {
            return d.target.x
          }
        })
        .attr('y2', function(d) {
          if (d.target.type == 'center') {
            return (STYLES.height / 2)
          }
          else {
            return d.target.y
          }
        })

      node.attr('transform', function(d) {
        if (d.type == 'center') {
          d.x = STYLES.width / 2
          d.y = STYLES.height / 2
        }
        return 'translate(' + d.x + ',' + d.y + ')'
      })
    })

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

// Moves the node and the edge attached to it upon mouse drag
  dragMove(d){
    d3.select(this).attr('cx', d3.event.x)
    d3.select(this).attr('cy', d3.event.y)
    d3.select('#'+d.triples.name).attr('x1', d3.event.x)
    d3.select('#'+d.triples.name).attr('y1', d3.event.y)
  }
}
