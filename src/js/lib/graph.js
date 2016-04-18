// THIS FILE TAKES CARE OF DRAWING THE D3 GRAPH
// It is passed a state from the graph.jsx file, and then it draws
// the graph according to that state. The element itself is stateless.
// Currently I have issues with doing persistent changes here, for instance
// a moved node will not save upon refresh.

import d3 from 'd3'
import STYLES from 'styles/app'

export default class GraphD3 {

  constructor(el, state){
    this.el = el
    this.state = state
    this.createBackground()
  }

  createBackground(){

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

    console.log(this.height)

    this.svg.append('svg:circle')
      .attr('cx', this.width * 0.5)
      .attr('cy', this.height * 0.5)
      .attr('r', this.width / 6)
      .style('fill', STYLES.lightGrayColor)

    this.drawGraph()
  }

  drawGraph(){
    // Takes care of node dragging.
    let drag = d3.behavior.drag()
      .on('drag', this.dragMove)

    let centerWork = [this.state.center]

    this.svg.selectAll('connections')
      .data(this.state.neighbours)
      .enter()
      .append('line')
      .attr('id', (d) => {return d.triples.name})
      .attr('x1', (d) => {return d.triples.x})
      .attr('y1', (d) => {return d.triples.y})
      .attr('x2', this.width / 2)
      .attr('y2', this.height / 2)
        .style('stroke-width', this.width / 60)
        .style('stroke', STYLES.lightGrayColor)
        .style('fill', 'none')

    this.svg.selectAll('center_node')
      .data(centerWork)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('cx', this.width / 2)
      .attr('cy', this.height / 2)
      .attr('r', STYLES.largeNodeSize/2)
      .attr('width', STYLES.largeNodeSize)
      .attr('height', STYLES.largeNodeSize)
      .style('fill', STYLES.grayColor)
      .style('stroke','white')
      .style('stroke-width', 0)

    this.svg.selectAll('neighbour_node')
      .data(this.state.neighbours)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('cx', (d) => { return d.triples.x })
      .attr('cy', (d) => { return d.triples.y })
      .attr('r', STYLES.smallNodeSize / 2)
      .attr('width', STYLES.smallNodeSize)
      .attr('height', STYLES.smallNodeSize)
      .style('fill', STYLES.grayColor)
      .style('stroke','white')
      .style('stroke-width', 0)
      .call(drag)
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
