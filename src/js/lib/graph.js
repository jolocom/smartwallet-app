import d3 from 'd3'

import Util from './util.js'
import STYLES from 'styles/app'

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this)
  })
}

export default class GraphD3 {

  constructor(el, state){
    console.log(state, 'this is what i get here now')
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
    let centerWork = [this.state.center]

    let connections = this.svg.selectAll('connections')
      .data(this.state.neighbours)
      .enter()
      .append('line')
      .attr('x1', (d) => {return d.triples.x})
      .attr('y1', (d) => {return d.triples.y})
      .attr('x2', this.width / 2)
      .attr('y2', this.height / 2)
        .style('stroke-width', this.width / 60)
        .style('stroke', STYLES.lightGrayColor)
        .style('fill', 'none')

    let center = this.svg.selectAll('center_node')
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

    let neighbours = this.svg.selectAll('neighbour_node')
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

  }

  setSize() {
    this.width = this.el.offsetWidth
    this.height = this.el.offsetHeight

    this.svg.attr('width', this.width).attr('height', this.height)
  }

  onResize() {
    this.setSize()
  }

  // Invoked in 'componentDidUpdate' of react graph
  update(prevState, state) {
    let self = this
    let svg = d3.select(this.el).select('svg').select('g')


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
      // .call(this.force.drag)

    console.log('NEW LINKS', linkNew[0].length)

    // add line
    linkNew.append('svg:line')
      .attr('class', 'link')
      .attr('stroke-width', this.width / 80)
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

    let nodeNew = node.enter().append('svg:g')
      .attr('class', 'node')
      .attr('dx', '80px')
      .attr('dy', '80px')

    nodeNew.style('opacity', 0)
      .transition()
      .style('opacity', 1)

    console.log('NEW NODES', nodeNew[0].length)

    // add circle
    nodeNew.filter((d) => d.type == 'uri')
      .append('svg:circle')
      .attr('class', 'node')
      .attr('r', STYLES.smallNodeSize/2)
      .attr('x', '-8px')
      .attr('y', '-8px')
      .attr('width', STYLES.smallNodeSize)
      .attr('height', STYLES.smallNodeSize)
      .style('fill', (d) => {
        if (d.nodeType === 'sensor') {
          return this.getSensorColor(d.title)
        }
        return STYLES.grayColor
      })
      .style('stroke', 'white')
      .style('stroke-width', 0)

    // add title text (visible when not in preview)
    nodeNew.filter((d) => d.type == 'bnode' || d.type == 'uri')
      .append('svg:text')
      .attr('class', 'nodetext')
      .style('fill', '#ffffff')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .text((d) => d.title)
      .call(this.wrap, STYLES.smallNodeSize * 0.9, '', '') // returns only wrapped titles, so we can push them up later

    nodeNew.filter((d) => d.nodeType == 'sensor')
      .call(function(nodes) {
        nodes.each(function(d) {
          self.subscribeToUpdates(this, d)
        })
      })

    // remove old nodes
    let nodeOld = node.exit()
    console.log('OLD NODES', nodeOld[0].length)
    nodeOld.transition()
      .style('opacity', 0)
      .remove()
      .call(function(nodes) {
        nodes.each(function(d) {
          if (d.subscription)
            sensorAgent.unsubscribe(d.subscription)
        })
      })

    // NB(philipp): on init, the `fixed`-attribute of nodes is cleared
    // and needs to be re-set. also, the asynchronous cal    this.changeCenter(node, prevState.centerNode, state.centerNode, state.historyNodes)

    { // init history
      if(state.historyNodes.length > 0){
        let lastStep = state.nodes.filter((d) => {
          return d.uri == state.historyNodes[state.historyNodes.length - 1].uri })[0]
        lastStep.fixed = true
        this.animateNode(lastStep,
                     this.width / 2,
                     this.height * 4/5)
      }
    }


    // init center perspective
    this.changeCenter(node, prevState.centerNode, state.centerNode, state.historyNodes)

    { // init history
      if(state.historyNodes.length > 0){
        let lastStep = state.nodes.filter((d) => {
          return d.uri == state.historyNodes[state.historyNodes.length - 1].uri })[0]
        lastStep.fixed = true
        this.animateNode(lastStep,
                     this.width / 2,
                     this.height * 4/5)
      }
    }

    { // init new node, if applicable
      if(state.newNodeURI !== undefined){
        let newNode = node.filter((d) => d.uri == state.newNodeURI)
        if(newNode.length > 0){
          newNode
            .interrupt()
            .style('opacity', 1)
            .select('circle')
            .style('fill', STYLES.highLightColor)
          newNode
            .transition().duration(2000)
            .style('fill', STYLES.grayColor)
        }
      }
    }

    { // init preview
      this.disablePreview(node)
      // find dom node to preview and enablePreview on it
      let toPreview = node.filter((d) => d.uri == state.previewNode.uri)
      this.enablePreview(toPreview)
    }

    //plus drawer opening (closing is handled in 'beforeUpdate')
    if (!prevState.plusDrawerOpen && state.plusDrawerOpen) {
      document.getElementsByTagName('body')[0].className = 'open-drawer'
      d3.select('#plus_drawer')
        .transition()
        .style('top', (this.height / 2)+'px')

      this.zoomTo(0.5,
               this.width / 2,
               0)
    }

    //chat opening (closing is handled in 'beforeUpdate')
    if (!prevState.chatOpen && state.chatOpen) {
      d3.select('#chat')
        .transition()
        .style('top', (this.height / 3)+ 'px')

      this.zoomTo(0.5,
        this.width / 2,
        this.height / -6)
    }

    // First node added to inbox - animate InboxCounter
    if (prevState.inboxCount == 0 && state.inboxCount == 1) {
      d3.select('#inbox .counter')
        .transition()
        .style('opacity', 1)
    }

    // Spring inbox whenever a node is added/removed
    if (prevState.inboxCount != state.inboxCount && state.inboxCount >= 1) {
      //let size = (self.inbox.count==0)
        //?(-this.width)
        //:(-this.width+(this.width/5))

      let size = -this.width + (this.width/5)

      d3.select('#inbox')
        .transition()
        .style('right', size+'px')
    }

    // inbox opening (closing is handled in 'beforeUpdate')
    if (!prevState.inboxOpen && state.inboxOpen) {
      this.zoomTo(0.5,
               this.width / 2,
               this.height)
    }


    //NOTE(philipp): if necessary, use `mobilecheck` to assign different events for mobile and desktop clients
    node.on('click', null) // NOTE(philipp): unbind old `openPreview` because it captured the  outdated `node` variable

    //node.on('click', this.openPreview(state.nodes))
    node.on('click', this.onNodeClick)

    let pressTimer

    node.on('mouseup', () => {
      clearTimeout(pressTimer)
      return false
    })

    node.on('mousedown', (d) => {
      pressTimer = window.setTimeout(() => {
        this.onNodeLongPress(d)
      }, LONG_PRESS_TIMEOUT)
      return false
    })
  }

  // Invoked in 'componentWillUpdate' of react graph
  beforeUpdate(state, nextState) {
    //plus drawer closing (opening is handled in 'update')
    if (state.plusDrawerOpen && !nextState.plusDrawerOpen) {
      document.getElementsByTagName('body')[0].className = 'closed-drawer'
      d3.select('#plus_drawer')
        .transition()
        .style('top', this.height+'px')
      this.zoomReset()
    }

    //chat closing (opening is handled in 'update')
    if (state.chatOpen && !nextState.chatOpen) {
      d3.select('#chat')
        .transition()
        .style('top', this.height + 'px')
      this.zoomReset()
    }

    // inbox closing (opening is handled in 'update')
    if (state.inboxOpen && !nextState.inboxOpen) {
      this.zoomReset()
    }
  }

  // touchStart and touchEnd are logging tap-times
  tapStart() {
    let self = this
    return function () {
      self.taptimer.start = d3.event.sourceEvent.timeStamp
    }
  }

  tapEnd(){
    let self = this
    return function() {
      self.taptimer.end = d3.event.sourceEvent.timeStamp
      if((self.taptimer.end - self.taptimer.start) < 200){
        return true
      }
      return false
    }
  }


  // catch nodeClick event and forward it to react
  onNodeClick(d) {
    this.handleNodeClick(d)
  }

  onNodeLongPress(d) {
    this.handleLongPress(d)
  }

  // graph zoom/scale
  zoomTo(scale, x, y) {
    let svg = d3.select(this.el).select('svg').select('g')
    svg.transition()
      .attr('transform', 'scale('+ scale + ') translate(' + x + ',' + y + ')')
  }

  zoomReset() {
    let svg = d3.select(this.el).select('svg').select('g')
    svg.transition()
      .attr('transform', 'scale(1) translate(0, 0)')
  }


  animateNode(d, x, y) {
    console.log(d)
    // http://stackoverflow.com/questions/19931383/animating-elements-in-d3-js
    d3.select(d).transition().duration(1000)
      .tween('x', () => {
        let i = d3.interpolate(d.x, x)
        return function(t) {
          d.x = i(t)
          d.px = i(t)
        }
      }).tween('y', () => {
        let i = d3.interpolate(d.y, y)
        return function(t) {
          d.y = i(t)
          d.py = i(t)
        }
      })
  }

  changeCenter(domNodes, oldCenter, newCenter, historyNodes){
    newCenter.node.fixed = true
    if (!oldCenter) {
      //initialization- no transition needed
      this.animateNode(newCenter.node,
                   this.width / 2,
                   this.height / 2)

      this.getDomNode(domNodes, newCenter)
        .select('circle')
        .style('fill', STYLES.blueColor)
      return
    }

    if (oldCenter.node != newCenter.node) {
      // update center perspective
      { // treat old center & update node history
        let oldCenterDom = this.getDomNode(domNodes, oldCenter)

        oldCenterDom
          .select('circle')
          .style('fill', STYLES.lightBlueColor)

        this.animateNode(oldCenter.node,
                     this.width / 2,
                     this.height * 4/5)

        if(historyNodes.length > 1){
          let historic = historyNodes[historyNodes.length - 2]
          if (historic.node != newCenter.node)
            historic.node.fixed = false

          let historicDom = this.getDomNode(domNodes, historic)
          historicDom
            .select('circle')
            .style('fill', STYLES.grayColor)
        }
      }
      {
        let newCenterDom = this.getDomNode(domNodes, newCenter)
        this.animateNode(newCenter.node,
                     this.width / 2,
                     this.height / 2) // move to center
        newCenterDom
          .select('circle')
          .style('fill', STYLES.blueColor)
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
               'stroke-width': this.width / 100 })
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
  }
}
