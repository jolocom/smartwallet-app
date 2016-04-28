// THIS FILE TAKES CARE OF DRAWING THE D3 GRAPH
// It is passed a state from the graph.jsx file, and then it draws
// the graph according to that state. The element itself is stateless.
// Currently I have issues with doing persistent changes here, for instance
// a moved node will not save upon refresh.

import d3 from 'd3'
import STYLES from 'styles/app'
import graphActions from '../actions/graph-actions'

export default class GraphD3 {









  constructor(el, state){
    this.el = el
    this.width = STYLES.width
    this.height = STYLES.height

    this.dataLinks = []
    this.dataNodes = [state.center]

    // Flatten the center and neighbour nodes we get from the state
    for (var i = 0; i < state.neighbours.length; i++) {
      this.dataNodes.push(state.neighbours[i])
      this.dataLinks.push({'source': i + 1, 'target':0})
    }
  }







   setUpForce(){
    this.force = d3.layout.force()
      .nodes(this.dataNodes)
      .links(this.dataLinks)
      .charge(-15000)
      .friction(0.8)
      .gravity(0.2)
      .size([this.width, this.height])
      .start()
  }




  eraseGraph(){
    this.force.stop()
    d3.selectAll('svg').remove()
    d3.selectAll('rect').remove()
    d3.selectAll('circle').remove()
    d3.selectAll('line').remove()
    d3.selectAll('.node').remove()
    d3.selectAll('defs').remove()
  }






  drawGraph() {
    // Drawing the background
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

    let link =  this.svg.selectAll('line')
      .data(this.dataLinks)
      .enter()
      .append('line')
      .attr('class','link')
      .attr('stroke-width', STYLES.width / 45)
      .attr('stroke', STYLES.lightGrayColor)

    let node = this.svg.selectAll('.node')
      .data(this.dataNodes)
      .enter()
      .append('g')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('class','node')
      .call(this.force.drag)

    let defs = node.append('svg:defs')
    defs.append('svg:pattern')
      .attr('id',  (d)=> d.name)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize/2 : STYLES.smallNodeSize/2
      })
      .attr('y', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize/2 : STYLES.smallNodeSize/2
      })
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', (d) => d.img)
      .attr('width', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize : STYLES.smallNodeSize
      })
      .attr('height', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize : STYLES.smallNodeSize
      })

    node.append('circle')
      .attr('r', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize/2 : STYLES.smallNodeSize/2
      })
      .style('fill', (d) => {
        return d.img ? 'url(#'+d.name+')' : STYLES.blueColor
      })
      .attr('stroke',STYLES.grayColor)
      .attr('stroke-width',2)

    node.on('click', function(){
      graphActions.highlight(this)
    })

    this.force.on('tick', function() {
      link.attr('x1', (d) => { return d.source.x })
        .attr('y1', (d) => { return d.source.y })
        .attr('x2', (d) => { return d.target.x })
        .attr('y2', (d) => { return d.target.y })

      node.attr('transform', function(d) {
        if (d.rank == 'center') {
          d.x = STYLES.width / 2
          d.y = STYLES.height / 2
        }
        return 'translate(' + d.x + ',' + d.y + ')'
      })
    })
  }








  onResize() {
    this.setSize()
  }




  setSize() {
    this.width = this.el.offsetWidth
    this.height = this.el.offsetHeight
    this.svg.attr('width', this.width).attr('height', this.height)
  }
}
