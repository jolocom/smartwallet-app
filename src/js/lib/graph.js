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

  }

   setUpForce = function(){
    this.force = d3.layout.force()
      .nodes(this.dataNodes)
      .links(this.dataLinks)
      .charge(-12500)
      .linkDistance(STYLES.largeNodeSize * 0.8)
      .friction(0.8)
      .gravity(0.2)
      .size([this.width, this.height])
      .start()
  }.bind(this)

  eraseGraph = function(){
    this.force.stop()
    this.svg.selectAll('*').remove()
  }.bind(this)

  drawBackground = function() {

    // Drawing the background
    let centerSize = STYLES.largeNodeSize
    let neighbSize = STYLES.smallNodeSize


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
      .attr('r', centerSize * 0.57)
      .style('fill', STYLES.lightGrayColor)

  }.bind(this)

    drawNodes = function(state) {
      this.dataLinks = []
      this.dataNodes = [state.center]

      // Flatten the center and neighbour nodes we get from the state
      for (var i = 0; i < state.neighbours.length; i++) {
        this.dataNodes.push(state.neighbours[i])
        this.dataLinks.push({'source': i + 1, 'target':0})
      }

      this.setUpForce()

      let link =  this.svg.selectAll('line')
        .data(this.dataLinks)
        .enter()
        .append('line')
        .attr('class','link')
        .attr('stroke-width', (d) => {
          return STYLES.width / 45 > 13 ? 13 : STYLES.width / 45})
        .attr('stroke', STYLES.lightGrayColor)

      let node = this.svg.selectAll('.node')
        .data(this.dataNodes)
        .enter()
        .append('g')
        .attr('class','node')
        .call(this.force.drag)

      let defs = node.append('svg:defs')
      defs.append('svg:pattern')
        .attr('id',  (d)=> d.uri)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('x', (d) => {
          return d.rank == 'center' ? -STYLES.largeNodeSize / 2 : -STYLES.smallNodeSize / 2
        })
        .attr('y', (d) => {
          return d.rank == 'center' ? -STYLES.largeNodeSize / 2 : -STYLES.smallNodeSize / 2
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

    let defsImages = node.append('svg:defs')
    defsImages.append('svg:pattern')
      .attr('id',  (d)=> d.uri)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', (d) => {
        return d.rank == 'center' ? -STYLES.largeNodeSize / 2 : -STYLES.smallNodeSize / 2
      })
      .attr('y', (d) => {
        return d.rank == 'center' ? -STYLES.largeNodeSize / 2 : -STYLES.smallNodeSize / 2
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

      let defsFilter = this.svg.append('svg:defs')

      let filter = defsFilter.append('filter')
      .attr('id', 'darkblur')

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
    filter.append('feGaussianBlur')
        .attr('stdDeviation', 1.5)

    let componentTransfer = filter.append('feComponentTransfer')
    componentTransfer.append('feFuncR')
        .attr('type', 'linear')
        .attr('slope', 0.6)

    componentTransfer.append('feFuncG')
        .attr('type', 'linear')
        .attr('slope', 0.6)

    componentTransfer.append('feFuncB')
        .attr('type', 'linear')
        .attr('slope', 0.6)

    node.append('circle')
      .attr('r', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize / 2 : STYLES.smallNodeSize / 2
      })
      .style('fill', (d) => {
        return d.img ? 'url(#'+d.uri+')' : STYLES.blueColor
      })
      .attr('stroke',STYLES.grayColor)
      .attr('stroke-width',2)

    node.append('svg:text')
    .attr('class', 'nodetext')
    .style('fill', '#e6e6e6')
    .attr('text-anchor', 'middle')
    .attr('opacity',(d) => {
      return d.img ? 0 : 1})
    .attr('dy', '.35em')
    .style('font-weight', 'bold')
    .text((d) => d.name)


    node.append('svg:text')
    .attr('class', 'nodedescription')
    .style('fill', '#e6e6e6')
    .attr('text-anchor', 'middle')
    .attr('opacity', 0)
    .attr('dy', 1)
    .style('font-size', '80%')
    .text(function (d) {
      if(d.description.length>50) return (d.description.substring(0, 50)+'...')
      else return d.description
    })
    .call(this.wrap, STYLES.largeNodeSize * 0.7, '', '')

    node.on('dblclick', (d) => {
      console.log(d)
    })

    node.on('click', this.onClick)
    node.on('dblclick', this.onDblClick)

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
  }.bind(this)

  addNode= function(node){

    this.force.stop()
    this.dataNodes.push(node)
    this.dataLinks.push({source: this.dataNodes.length - 1, target: 0})

    let link_update = this.svg.selectAll('.link')
      .data(this.force.links(), (d) => {return d.source.uri + '-' + d.target.uri})

    link_update.enter()
      .insert('line', '.node')
      .attr('class','link')
      .attr('stroke-width', (d) => {
        return STYLES.width / 45 > 13 ? 13 : STYLES.width / 45})
      .attr('stroke', STYLES.lightGrayColor)

    let node_update = this.svg.selectAll('g .node')
      .data(this.force.nodes(), (d) => {return d.uri})

    node_update.enter()
      .append('g')
      .call(this.force.drag)
      .attr('class','node')

    node_update.append('svg:defs')
      .append('svg:pattern')
      .attr('id',  (d)=> d.uri)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', (d) => {
        return d.rank == 'center' ? -STYLES.largeNodeSize / 2 : - STYLES.smallNodeSize / 2
      })
      .attr('y', (d) => {
        return d.rank == 'center' ? -STYLES.largeNodeSize / 2 : - STYLES.smallNodeSize / 2
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

      node_update.append('circle')
        .attr('r', (d) => {
          return d.rank == 'center' ? STYLES.largeNodeSize/2 : STYLES.smallNodeSize/2
        })
        .style('fill', (d) => {
          return d.img ? 'url(#'+d.uri+')' : STYLES.blueColor
        })
        .attr('stroke',STYLES.grayColor)
        .attr('stroke-width',2)

    node_update.on('click', this.onClick)
    node_update.on('dblclick', this.onDblClick)

    this.force.start()
  }.bind(this)

  reSizeNodes(){

  }


  onClick() {

    // This makes sure that dragging does not cause a click to fire
    if(d3.event.defaultPrevented) return

    d3.selectAll('g .node').selectAll('circle')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('r', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize / 2 : STYLES.smallNodeSize / 2
      })

      d3.selectAll('g .node').selectAll('pattern')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('x', (d) => {
        return d.rank == 'center' ? -STYLES.largeNodeSize / 2 : -STYLES.smallNodeSize / 2
      })
      .attr('y', (d) => {
        return d.rank == 'center' ? -STYLES.largeNodeSize / 2 : -STYLES.smallNodeSize / 2
      })

      d3.selectAll('g .node').selectAll('image')
      .transition().duration(STYLES.nodeTransitionDuration)
      .attr('width', (d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize : STYLES.smallNodeSize
      })
      .attr('height',(d) => {
        return d.rank == 'center' ? STYLES.largeNodeSize : STYLES.smallNodeSize
      })
      .style('filter', null)

      d3.selectAll('g .node').selectAll('.nodetext')
      .attr('opacity', (d) => {
        return d.img ? 0 : 1})
      .attr('dy', '.35em')

      d3.selectAll('g .node').selectAll('.nodedescription')
      .attr('opacity', 0)


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
      .style('filter', 'url(#darkblur)')

      //TODO apply transition breaks the action
      d3.select(this).select('.nodetext')
      .attr('dy', -10.5)

      d3.select(this).selectAll('text')
      .transition().duration(STYLES.nodeTransitionDuration/2)
      .attr('opacity', 1)
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


    onDblClick = function(node) {
      if (node.rank == 'center'){
        console.log('card should open here')
      } else {
        graphActions.navigateToNode(node)
      }
    }.bind(this)


  onResize = function() {
    this.setSize()
  }.bind(this)

  setSize = function() {
    this.width = this.el.offsetWidth
    this.height = this.el.offsetHeight
    this.svg.attr('width', this.width).attr('height', this.height)
  }.bind(this)
}
