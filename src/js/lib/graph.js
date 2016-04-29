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
    this.setUpForce()
  }

   setUpForce(){
    this.force = d3.layout.force()
      .nodes(this.dataNodes)
      .links(this.dataLinks)
      .charge(-12500)
      .friction(0.8)
      .gravity(0.2)
      .size([this.width, this.height])
      .start()
    this.drawGraph()
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

    node.on('click', this.onClick)

    this.force.on('tick', function() {
      d3.selectAll('.link').attr('x1', (d) => {return d.source.rank =='center' ? STYLES.width/2 : d.source.x})
        .attr('y1', (d) => {return d.source.rank =='center' ? STYLES.height/2 : d.source.y})
        .attr('x2', (d) => {return d.target.rank =='center' ? STYLES.width/2 : d.target.x})
        .attr('y2', (d) => {return d.target.rank =='center' ? STYLES.height/2 : d.target.y})

      d3.selectAll('g .node').attr('transform', function(d) {
        if (d.rank == 'center') {
          d.x = STYLES.width / 2
          d.y = STYLES.height / 2
        }
        return 'translate(' + d.x + ',' + d.y + ')'
      })
    })

  setTimeout(() => {
      this.addNode({name:'eugen', index: 3, x: STYLES.width / 2 + 30, y: STYLES.height / 2 + 20}, {source: 3, target: 0})
    }, 2000)

  setTimeout(() => {
      this.addNode({name:'eugen', index: 4, x: STYLES.width / 2 + 30, y: STYLES.height / 2 + 20}, {source: 4, target: 0})
    }, 4000)

  setTimeout(() => {
      this.addNode({name:'eugen', index: 5, x: STYLES.width / 2 + 30, y: STYLES.height / 2 + 20}, {source: 5, target: 0})
    }, 6000)

  setTimeout(() => {
      this.addNode({name:'eugen', index: 6, x: STYLES.width / 2 + 30, y: STYLES.height / 2 + 20}, {source: 6, target: 0})
    }, 8000)

  setTimeout(() => {
      this.addNode({name:'eugen', index: 7, x: STYLES.width / 2 + 30, y: STYLES.height / 2 + 20}, {source: 7, target: 0})
    }, 10000)

  setTimeout(() => {
      this.addNode({name:'eugen', index: 8, x: STYLES.width / 2 + 30, y: STYLES.height / 2 + 20}, {source: 8, target: 0})
    }, 12000)

  }


  addNode(node, link){
    this.force.stop()

    this.dataNodes.push(node)
    if(link) this.dataLinks.push(link)

    let link_update = this.svg.selectAll('.link')
      .data(this.force.links(), (d) => {return d.source.index + '-' + d.target.index})

    link_update.enter()
      .insert('line', '.node')
      .attr('class','link')
      .attr('stroke-width', STYLES.width / 45)
      .attr('stroke', STYLES.lightGrayColor)

    let nodes_update = this.svg.selectAll('g .node')
      .data(this.force.nodes(), (d) => {return d.index})

    nodes_update.enter()
      .append('g')
      .call(this.force.drag)
      .attr('class','node')
        .append('circle')
        .attr('r', (d) => {
          return d.rank == 'center' ? STYLES.largeNodeSize/2 : STYLES.smallNodeSize/2
        })
        .style('fill', (d) => {
          return d.img ? 'url(#'+d.name+')' : STYLES.blueColor
        })
        .attr('stroke',STYLES.grayColor)
        .attr('stroke-width',2)

    nodes_update.on('click', this.onClick)

    this.force.start()
  }

  onClick() {
    d3.selectAll('g .node').selectAll('circle')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('r', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize / 2 : STYLES.smallNodeSize / 2
      })

      d3.selectAll('g .node').selectAll('pattern')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('x', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize / 2 : STYLES.smallNodeSize / 2
      })
      .attr('y', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize / 2 : STYLES.smallNodeSize / 2
      })

      d3.selectAll('g .node').selectAll('image')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('width', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize : STYLES.smallNodeSize
      })
      .attr('height',(d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize : STYLES.smallNodeSize
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
