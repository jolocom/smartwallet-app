// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/

import React from 'react/addons'

import N3 from 'n3'
import d3 from 'd3'
import url from 'url'

import D3Converter from '../lib/d3-converter.js'
import WebAgent from '../lib/web-agent.js'

import STYLES from './styles.js'

import Chat from './chat.jsx'
import Inbox from './inbox.jsx'
import PlusDrawer from './plus-drawer.jsx'

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this)
  })
}


let agent = new WebAgent()
let testData = '{"nodes":[{"name":"https://sister.jolocom.com/reederz/profile/card#me","type":"uri","uri":"https://sister.jolocom.com/reederz/profile/card#me","title":"no title","description":"no description"},{"name":"https://sister.jolocom.com/reederz/profile/card#key","type":"uri","uri":"https://sister.jolocom.com/reederz/profile/card#key","title":"no title","description":"no description"}],"links":[{"source":"0","target":"1","name":" http://www.w3.org/ns/auth/cert#key","value":"10"}],"literals":{"https://sister.jolocom.com/reederz/profile/card":[{"p":"http://purl.org/dc/terms/title","o":"WebID profile of Justas Azna","l":"None","d":"http://www.w3.org/2001/XMLSchema#string"}],"https://sister.jolocom.com/reederz/profile/card#key":[{"p":"http://www.w3.org/ns/auth/cert#modulus","o":"a726cd1e3eddccb4c12ebd3d8581ac83bc2913dfb88cf9d939b5eedff88878e95b9bfa278dc4fbcd5dfe7d80ff866844b69af31f30a79822e32841f3e694d75feeaba92ed91b02be46fd3f86bb800d3be222c4cb480ffa05f87f67949f41324cacc4c34ee9d133d19eb61af71ab6d97048af91d357904b1cdec8333affe1f4098cdd6f6ca465bdbae56e0b006557396dc0abb7ed2c4f3a41dd76ef07cfeb8309e80804b0c288e6e847c0b446d112403d77c939c67b30cc99a96cd695c8dbc53a5afe42bf81c53214ace49c2ce6b5dc35a0c5301dca386d9735b6d7f39c5185a6811459446940ec7b5a5050fc22c6f99844a1b9580ff0972049e898d1e16a3373","l":"None","d":"http://www.w3.org/2001/XMLSchema#hexBinary"},{"p":"http://www.w3.org/ns/auth/cert#exponent","o":"65537","l":"None","d":"http://www.w3.org/2001/XMLSchema#int"}],"https://sister.jolocom.com/reederz/profile/card#me":[{"p":"http://xmlns.com/foaf/0.1/mbox","o":"mailto:justas.azna@gmail.com","l":"None","d":"http://www.w3.org/2001/XMLSchema#string"},{"p":"http://xmlns.com/foaf/0.1/name","o":"Justas Azna","l":"None","d":"http://www.w3.org/2001/XMLSchema#string"}]}}'



class GraphD3 {

  constructor(el, props, state, openInbox, addNodeToInbox, showChat) {
    // the node being centered (target of 'connect' interactions)
    this.thePerspective = {
      uri: "",
      node: {
        px: STYLES.width / 2,
        py: STYLES.height / 2
      },
      dom: {}
    }

    // Call to change the state of Inbox component
    this.openInbox = openInbox
    this.addNodeToInbox = addNodeToInbox
    this.showChat = showChat

      // the node showing the large preview circle
    this.thePreview = {
      uri: "",
      node: {}
    }

    this.nodeHistory = []

    this.newNodeURI = null

    // TODO: how many height/width vars do we have?
    this.w = document.getElementById("chart").offsetWidth
    this.h = document.getElementById("chart").offsetHeight

    let svg = d3.select("#chart").append("svg:svg")
      .attr("width", this.w)
      .attr("height", this.h)
      .attr("pointer-events", "all")
      .append('svg:g')

      
    //background rectangle
    svg.append('svg:rect')
      .attr('width', this.w)
      .attr('height', this.h)
      .attr('fill', 'white')

    //background circle
    svg.append( "svg:circle" )
      .attr( "class", "plate" )
      .attr( "cx", STYLES.width * 0.5 )
      .attr( "cy", STYLES.height * 0.5)
      .attr( "r", STYLES.width * 0.3 )
      .style( "fill", STYLES.lightGrayColor )


    // `base` only needs to run once
  	this.force = d3.layout.force()
  	this.force
      .nodes(state.nodes)
  	  .links(state.links)
  	  .gravity(0.2)
  	  .charge( STYLES.width * -14)
  	  .linkDistance( STYLES.width / 3 )
  	  .size([this.w, this.h])
      .start()


    //group links (so they don't overlap nodes)
    svg.append( "g" ).attr( "class", "link_group")
  }

  update(el, state) {
    let svg = d3.select('#chart').select('svg').select('g')
    console.log(svg)

  	this.force
      .nodes(state.nodes)
  	  .links(state.links)
      .start()
  
    // --------------------------------------------------------------------------------
    // links
  
    // data binding
    let linkGroup = d3.select('#chart').select('svg').select('g.link_group')
    linkGroup.selectAll("g.link").remove() // remove old links entirely
  	let link = linkGroup.selectAll("g.link")
  	  .data(state.links, (d) => {
        // this retains link-IDs over changing target/source direction
        // NB: not really useful in our case
        let first = this.stringMin( d.source.uri, d.target.uri )
        let last = this.stringMax( d.source.uri, d.target.uri )
        return first + last
      })
  
    // only new links
    let linkNew = link.enter()
      .append("svg:g").attr("class", "link")
  	  .call(this.force.drag)
  
    console.log( "NEW LINKS", linkNew[0].length )
  
    // add line
  	linkNew.append("svg:line")
  	  .attr("class", "link")
      .attr("stroke-width", STYLES.width / 45 )
  	  .attr("stroke", STYLES.lightGrayColor ) //TODO(philipp) reverse
  	  .attr("x1", (d) => d.x1)
  	  .attr("y1", (d) => d.y1)
  	  .attr("x2", (d) => d.x1)
  	  .attr("y2", (d) => d.y2)
  
    // remove old links
    let linkOld = link.exit()
    console.log( "OLD LINKS", linkOld[0].length )
    linkOld.transition().duration(2000).style("opacity", 0 ).remove()
  
    // --------------------------------------------------------------------------------
    // nodes
  	let node = svg.selectAll("g.node")
  	  .data(state.nodes, (d) => d.uri)
  
    let nodeNew = node.enter().append("svg:g")
  	  .attr("class", "node")
  	  .attr("dx", "80px")
  	  .attr("dy", "80px")
      .call( this.force.drag )
  
    nodeNew.style( "opacity", 0 )
      .transition()
      .style( "opacity", 1 )
  
    console.log( "NEW NODES", nodeNew[0].length )
  
    // add circle
  	nodeNew.filter((d) => d.type == "uri")
  	  .append("svg:circle")
  	  .attr("class", "node")
  	  .attr("r", STYLES.smallNodeSize/2)
  	  .attr("x", "-8px")
  	  .attr("y", "-8px")
  	  .attr("width", STYLES.smallNodeSize)
  	  .attr("height", STYLES.smallNodeSize)
  	  .style("fill", STYLES.grayColor)
  	  .style("stroke", "white")
      .style( "stroke-width", 0 )
  
    // add title text (visible when not in preview)
  	let wrappedTitles = nodeNew.filter((d) => d.type == "bnode" || d.type == "uri")
      .append("svg:text")
  	  .attr("class", "nodetext")
      .style( "fill", "#ffffff" )
      .attr("text-anchor", "middle" )
  	  .attr("dy", ".35em")
  	  .text((d) => d.title)
      .call( this.wrap, STYLES.smallNodeSize * 0.9, "", "" ) // returns only wrapped titles, so we can push them up later
  
    // remove old nodes
    let nodeOld = node.exit()
    console.log( "OLD NODES", nodeOld[0].length )
    nodeOld.transition()
      .style("opacity", 0 )
      .remove()
  
    // NB(philipp): on init, the `fixed`-attribute of nodes is cleared
    // and needs to be re-set. also, the asynchronous call to init can interrupt
    // the animation, so it is also re-started.
  
    { // init center perspective
      this.thePerspective.node = state.nodes[0]
      this.thePerspective.uri = state.nodes[0].uri
      this.thePerspective.node.fixed = true
      if( this.firstInit ){ // don't animate on very first init
        //gone
        
      } else {
        this.animateNode( this.thePerspective.node,
                     STYLES.width / 2,
                     STYLES.height / 2 )
      }
      this.getCenterNode( node )
        .select( "circle" )
        .style("fill", STYLES.blueColor )
    }
  
    { // init history
      if( this.nodeHistory.length > 0 ){
        let lastStep = state.nodes.filter( (d) => {
          return d.uri == this.nodeHistory[ this.nodeHistory.length - 1 ].uri })[0]
        lastStep.fixed = true
        this.animateNode( lastStep,
                     STYLES.width / 2,
                     STYLES.height * 4/5 )
      }
    }
  
    { // init new node, if applicable
      if( this.newNodeURI !== undefined ){
        let newNode = node.filter((d) => d.uri == this.newNodeURI)
        if( newNode.length > 0 ){
          newNode
            .interrupt()
            .style( "opacity", 1 )
            .select( "circle" )
            .style( "fill", STYLES.highLightColor )
          newNode
            .transition().duration( 2000 )
            .style( "fill", STYLES.grayColor )
        }
        this.newNodeURI = undefined
      }
    }
  
    { // init preview
      this.disablePreview( node )
      this.enablePreview( this.getCenterNode( node ) )
    }
  
    // --------------------------------------------------------------------------------
    // animation
  	let ticks = 0
  
  	this.force.on("tick", (e) => {
  	  ticks++
      // NOTE(philipp) uncomment this to 'freeze' graph while dragging
  	  //if( drag.active ){ return }
  
      // NOTE(philipp): keep going even after 300+ ticks. rock on!
  		// if (ticks > 300) {
  		// 	force.stop()
  		// 	force.charge(0)
  		// 	  .linkStrength(0)
  		// 	  .linkDistance(0)
  		// 	  .gravity(0)
  		// 	force.start()
  		// }
  
  		link.selectAll("line.link")
        .attr("x1", (d) => d.source.x )
  		  .attr("y1", (d) => d.source.y )
  		  .attr("x2", (d) => d.target.x )
  		  .attr("y2", (d) => d.target.y )
  
  		node
        .attr("transform", (d) => {
          // shift nodes _towards_ x center and _away_ from y center
          // (so they sit nicely on top & below the center perspective)
          let kx = 10 * e.alpha
          let ky = 4 * kx
          d.x += (d.x < ( STYLES.width / 2 ))  ?( kx ):( -kx )
          d.y += (d.y < ( STYLES.height / 2 )) ?( -ky ):( ky )
          return "translate(" + d.x + "," + d.y + ")"
        })
  	})

    // -----------------------------------------------------------------------------
    // helper functions
    let self = this
  
    let taptimer = {
      start: 0,
      end: 0
    }
  
    // touchStart and touchEnd are logging tap-times
    let tapStart = function() {
      taptimer.start = d3.event.sourceEvent.timeStamp
    }
  
    let tapEnd = function(){
      taptimer.end = d3.event.sourceEvent.timeStamp
      if(( taptimer.end - taptimer.start ) < 200 ){
        return true
      }
      return false
    }
  
    let openPreview = function (d){ // click == enable preview
      if( d.uri == self.thePreview.uri ) return
      self.disablePreview( node )
      self.thePreview.node = d
      self.thePreview.uri = d.uri
      self.enablePreview( d3.select( this ))
    }
  
    let drag = {
      active: false,
      starttime: 0,
      endtime: 0,
      onCenter: false,
      startPos: {},
      nowPos: {},
      distance: () => {
        console.log('hi there')
        console.log(drag)
        return self.distance( drag.startPos.x,
                         drag.startPos.y,
                         drag.nowPos.x,
                         drag.nowPos.y )
      }
    }
  
    let dragStart = function (d){
      tapStart()
      console.log( "dragStart" )
      console.log(d3.event)
      //if(d3.event.sourceEvent.touches){
        drag.active = true
        drag.startPos.x = drag.nowPos.x = d3.event.sourceEvent.pageX
        drag.startPos.y = drag.nowPos.y = d3.event.sourceEvent.pageY
        //drag.start = d3.event.sourceEvent.timeStamp
        if( d.uri == self.thePerspective.uri ){
          drag.onCenter = true
          window.setTimeout( triggerLongTap, 800 )
        } else {
          drag.onCenter = false
        }
        //force.stop()
        //d3.event.preventDefault()
      //}
    }
  
    let triggerLongTap = function (){
      console.log( "longtap triggered (by timeout)" )
      if( !drag.active ) return // drag event stopped before timeout expired
      if( drag.distance() > 40 ){
        self.openInbox()
      }
    }
  
    let dragMove = function (d){ // TODO
      console.log( "dragmove" )
      if( d == self.thePerspective.node ){ // center node grabbed
        drag.nowPos.x = d3.event.sourceEvent.pageX
        drag.nowPos.y = d3.event.sourceEvent.pageY
      } else {
        //d.fixed = true
      }
    }
  
    let dragEnd = function (d){
      console.log( "dragEnd" )
      console.log(d3.event)
      drag.active = false
      if( tapEnd() || d3.event.defaultPrevented ){
        // this is a click
        return
      }
      if( d == self.thePerspective.node ){
        // reset node position
        d.x, d.px = STYLES.width / 2
        d.y, d.py = STYLES.height / 2
        d3.select( this ).attr( "transform", (d) => "translate(" + d.x + "," + d.y + ")")
        // perspective node can be dragged into inbox (top of screen)
        console.log(d3.event)
        let y = d3.event.sourceEvent.pageY // NOTE(philipp): d3.touches[0][1] won't work (because there are no _current_ touches)
        console.log(drag.distance())
        if( drag.distance() < 40 ){
          //TODO: change chat state to "showing"
          self.showChat()
        } else if( y < STYLES.height / 3 ){

          //TODO: should communicate back to react
          self.addNodeToInbox( d )
        }
      } else {
        // surrounding nodes can be dragged into focus (center of screen)
        if( self.distance( d.x,
                      d.y,
                      STYLES.width / 2,
                      STYLES.height / 2 )
            < STYLES.width * (3/8)){
          self.changeCenter( d, d3.select( this ), node)
          self.disablePreview( node )
          self.thePreview.node = d
          self.thePreview.uri = d.uri
          self.enablePreview( d3.select( this ))
        }
      }

      //self.closeInbox()
    }

    // --------------------------------------------------------------------------------
    // interaction
    //NOTE(philipp): if necessary, use `mobilecheck` to assign different events for mobile and desktop clients
    node.on( "click", null ) // NOTE(philipp): unbind old `openPreview` because it captured the  outdated `node` variable
    node.on( "click", openPreview )

    
  
    this.force.drag()
      .on( "dragstart", dragStart )
      .on( "drag", dragMove )
      .on( "dragend", dragEnd )
  
    this.force.start()
  
  }

  destroy(el) {
    //empty
  }


  // graph zoom/scale
  zoomTo(scale, x, y) {
    let svg = d3.select('#chart').select('svg').select('g')
    svg.transition()
      .attr("transform", "scale( "+ scale + " ) translate(" + x + "," + y + ")")
  }

  zoomReset() {
    let svg = d3.select('#chart').select('svg').select('g')
    svg.transition()
      .attr("transform", "scale( 1 ) translate( 0, 0 )" )
  }


  animateNode( d, x, y ) {
    console.log('animate node')
    // http://stackoverflow.com/questions/19931383/animating-elements-in-d3-js
    d3.select(d).transition().duration( 1000 )
      .tween("x", () => {
        let i = d3.interpolate(d.x, x)
        return function(t) {
          d.x = i(t)
          d.px = i(t)
        }
      }).tween("y", () => {
        let i = d3.interpolate(d.y, y)
        return function(t) {
          d.y = i(t)
          d.py = i(t)
        }
      })
  }

  changeCenter(d, dom, node){
    console.log('change center')
    // update center perspective
    { // treat old center & update node history
      let oldCenter = {
        dom: this.getCenterNode( node ),
        uri: this.thePerspective.uri,
        node: this.thePerspective.node
      }
      console.log('old center')
      console.log(oldCenter)
      //oldCenter.node.fixed = false
      oldCenter.dom
        .select( "circle" )
        .style( "fill", STYLES.lightBlueColor )
      this.animateNode( oldCenter.node,
                   STYLES.width / 2,
                   STYLES.height * 4/5 )
      this.nodeHistory.push( oldCenter )
      if( this.nodeHistory.length > 1 ){
        let historic = this.nodeHistory[ this.nodeHistory.length - 2 ]
        historic.node.fixed = false
        historic.dom
          .select( "circle" )
          .style( "fill", STYLES.grayColor )
      }
    }
    { // assign & treat new center
      this.thePerspective.node = d
      this.thePerspective.uri = d.uri
      this.thePerspective.dom = this.getCenterNode( node )
      this.thePerspective.node.fixed = true
      this.animateNode( this.thePerspective.node,
                   STYLES.width / 2,
                   STYLES.height / 2 ) // move to center
      this.thePerspective.dom
        .select( "circle" )
        .style("fill", STYLES.blueColor )
    }
  
    this.force.start()
  }

  getCenterNode( allNodes ) {
    return allNodes.filter((d) => d.uri == this.thePerspective.uri)
  }

  // http://bl.ocks.org/mbostock/7555321
  wrap(text, width, separator, joiner) {
    if( separator == undefined ){
      separator = /\s+/
      joiner = " "
    }
    let hasWrapped = []
    text.each(function() {
      let text = d3.select(this),
      words = text.text().split( separator ).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
      while (word = words.pop()) {
        line.push(word)
        tspan.text(line.join( joiner ))
        if (tspan.node().getComputedTextLength() > width) {
          hasWrapped.push( this )
          line.pop()
          tspan.text(line.join( joiner ))
          line = [word]
          lineNumber++
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", ((lineNumber==0)?(dy+"em"):(lineHeight+"em"))) //++lineNumber * lineHeight + dy + "em") NOTE(philipp): dy is relative to previous sibling (== lineheight for all but first line)
            .text(word)
        }
      }
    })
    return hasWrapped
  }

  disablePreview( allNodes ){
    // resets ALL nodes
    allNodes.select("circle")
      .transition().duration( STYLES.nodeTransitionDuration )
      .attr("r", STYLES.smallNodeSize / 2 )
      .style( "stroke-width", 0 )
    allNodes.select( ".nodetext" )
      .transition().duration( STYLES.nodeTransitionDuration )
      .style( "opacity", 1 )
    allNodes.selectAll("g.extras")
      .transition().duration( STYLES.nodeTransitionDuration )
      .style("opacity", 0 )
      .remove()
  }

  enablePreview( node ){
    node.moveToFront()

    node
      .select("circle") // only current circle
      .transition().duration( STYLES.nodeTransitionDuration )
      .attr("r", STYLES.largeNodeSize / 2 )
      .style({ "stroke": "white",
               "stroke-width": STYLES.width / 100 })
    node.select( ".nodetext" )
      .transition().duration( STYLES.nodeTransitionDuration )
      .style( "opacity", 0 )
    let extras = node.append("svg:g")
      .attr("class", "extras" )
      .style("opacity", 0 )
    extras
      .append( "svg:text" )
      .attr( "class", "preview-title" )
      .attr( "text-anchor", "middle" )
      .attr( "dy", -1.5 ) //(STYLES.largeNodeSize / - 6 )) //(STYLES.largeNodeSize / 18 ))
      .text( (d) => d.title)
      .call( this.wrap, STYLES.largeNodeSize * 0.7, "", "" )
    extras
      .append("svg:text")
      .attr("class", "preview-description")
      .attr("text-anchor", "middle")
      .attr("dy", 1 )
      .text( (d) => d.description)
      .call( this.wrap, STYLES.largeNodeSize * 0.75 )
    extras
      .transition().duration( STYLES.nodeTransitionDuration )
      .style( "opacity", 1 )
    return node
  }

  stringLessThan( s1, s2 ){
    if( s1 < s2 ) return true
    return false
  }
  
  stringMin( s1, s2 ){
    if( this.stringLessThan( s1, s2 )) return s1
    return s2
  }
  
  stringMax( s1, s2 ){
    if( this.stringLessThan( s1, s2 )) return s2
    return s1
  }
  
  distance( x1, y1, x2, y2 ){
    console.log('calculating distance')
    console.log(x1)
    console.log(y1)
    console.log(x2)
    console.log(y2)
    return Math.sqrt( Math.pow(( x1 - x2 ), 2 ) +
                      Math.pow(( y1 - y2 ), 2 ))
  }
}


let Graph = React.createClass({

  getInitialState: function() {
    return {
      graph: null,
      pastNodes: [],
      nodes: [],
      inboxNodes: [],
      links: [],
      literals: [],
      chatOpen: false,
      inboxOpen: false,
      plusDrawerOpen: false,
    }
  },

  closeInbox: function() {
    console.log('closing inbox...')
    let state = {
      graph: this.state.graph,
      pastNodes: this.state.pastNodes,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: this.state.chatOpen,
      inboxOpen: false,
      plusDrawerOpen: this.state.plusDrawerOpen,
    }

    this.setState(state)

    console.log('inbox closed.')
  },

  openInbox: function() {
    console.log('opening inbox...')
    let state = {
      graph: this.state.graph,
      pastNodes: this.state.pastNodes,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: this.state.chatOpen,
      inboxOpen: true,
      plusDrawerOpen: this.state.plusDrawerOpen,
    }

    this.setState(state)

    console.log('inbox opened.')
  },
  //_drawGraph: function(center, triples, prefixes) {
    //console.log('drawing graph')
    //let d3graph = D3Converter.convertTriples(center, triples)
    //console.log('result')
    //console.log(d3graph)
  //},
  componentDidMount: function() {
    //d3g.prepareVars()
    //d3g.init(testData)
    console.log('graph component did mount')
    console.log(this.state)

    let jsonText = testData
    console.log(jsonText)

	  let json = JSON.parse(jsonText)

    //TODO: this stuff depends on side effects of mergeGraphs and arrangeNodes- rethink
    // TODO: this should happen on every state update
	  let res = this.mergeGraphs(json.nodes, json.links)
    this.arrangeNodes()
    let state = {
      graph: new GraphD3(null, null, this.state, this.openInbox, this.addNodeToInbox, this.showChat),
      pastNodes: [],
      nodes: res.nodes,
      inboxNodes: this.state.inboxNodes,
      links: res.links,
      literals: res.literals,
      chatOpen: false,
      inboxOpen: false,
      plusDrawerOpen: false,
    }

    this.setState(state)

    return
    let webid = null

    // who am I? (check "User" header)
    agent.head(document.location.origin)
      .then((xhr) => {
        console.log('head')
        console.log(xhr)
        webid = xhr.getResponseHeader('User')

        // now get my profile document
        return agent.get(webid)
      })
      .then((xhr) => {
        // parse profile document from text
        let triples = []
        let parser = N3.Parser()
        parser.parse(xhr.response, (err, triple, prefixes) => {
          if (triple) {
            triples.push(triple)
          } else {
            // render relevant information in UI
            this._drawGraph(webid, triples, prefixes)
          }
        })
      })
      .catch((err) => {
        console.log('error')
        console.log(err)
      })
  },

  componentDidUpdate: function() {
    //TODO
    console.log('graph component did update')
    this.state.graph.update(null, this.state)
  
  },

  componentWillUnmount: function() {
    //TODO
    console.log('graph component will unmount')
    this.state.graph.destroy(null)
  },

  addNode: function(node) {
    // @Justas: this pushes fake node & connections into d3
    // and is called by the 'plus'-button and the 'inbox' (see `./mobile-js/mobile.js`)
    let fullNode = {
      description: "A New Node",
      fixed: false,
      index: this.state.nodes.length,
      name: undefined, //"https://test.jolocom.com/2013/groups/moms/card#g",
      px: STYLES.width / 2, //undefined, //540,
      py: STYLES.height * 3/4, //undefined, //960,
      title: "NewNode",
      type: "uri",
      uri: "fakeURI" +( Math.random() * Math.pow( 2, 32 )), //"https://test.jolocom.com/2013/groups/moms/card#g",
      weight: 5,
      x: undefined, //539.9499633771337,
      y: undefined, //960.2001464914653
    }
    if( node == undefined ){
      node = fullNode
    } else {
      this.enrich(node, fullNode)
    }
    let link = { source: node,
             target: this.state.graph.thePerspective.node }
  
    //TODO: consider moving this directly under state
    this.state.graph.newNodeURI = node.uri // remember the URI so we can light the node up on init

    this.state.links.push(link)
    this.state.nodes.push(node)

    let state = {
      graph: this.state.graph,
      pastNodes: this.state.pastNodes,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: this.state.chatOpen,
      inboxOpen: this.state.inboxOpen,
      plusDrawerOpen: this.state.plusDrawerOpen,
    }

    this.setState(state)
    //TODO: connect node in database
  },

  showChat: function() {
    console.log('show chat')
    let state = {
      graph: this.state.graph,
      pastNodes: this.state.pastNodes,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: true,
      inboxOpen: this.state.inboxOpen,
      plusDrawerOpen: this.state.plusDrawerOpen,
    }
    this.setState(state)
  },

  addNodeToInbox: function(d) {
    console.log('addNodeToInbox')

    // FIXME: not guaranteed to be unique
    if (this.state.inboxNodes.filter((n) => n.name && n.name == d.name).length != 0) {
      console.log('Node is already in the inbox!')
      return
    }
    d.id = this.state.inboxNodes.length + 1
    this.state.inboxNodes.push(d)
    console.log(d)
    console.log(this.state.inboxNodes)
    this.setState(this.state)
  },

  enrich: function ( less, more ){
    // add any missing keys of `more` to `less`
    for( var k in more ){
      if(( more.hasOwnProperty( k )) && ( less[ k ] == undefined )){
        less[ k ] = more[ k ]
      }
    }
  },

  mergeGraphs: function(newNodes, newLinks) {
    console.log( 'merging' )
    let sIdx, tIdx
  	for(var i in newLinks){
  		sIdx = newLinks[i].source
  		tIdx = newLinks[i].target
      // add if source does not exist
  		if(this.state.nodes.indexOf(newNodes[sIdx]) == -1){
  			this.state.nodes.push(newNodes[sIdx])
  		}
  		newLinks[i].source = this.state.nodes.indexOf(newNodes[sIdx])
      // add if target does not exist
  		if(this.state.nodes.indexOf(newNodes[tIdx]) == -1){
  			this.state.nodes.push(newNodes[tIdx])
  		}
  		newLinks[i].target = this.state.nodes.indexOf(newNodes[tIdx])
      //
  		this.state.links.push(newLinks[i])
  	}
    return { nodes: this.state.nodes, links: this.state.links, literals: this.state.literals }
  },

  arrangeNodesInACircle: function( nodes ) {
    let angle = ( 2 * Math.PI )/ nodes.length
    let halfwidth = ( STYLES.width / 2 )
    let halfheight = ( STYLES.height / 2 )
    for( var i in nodes ){
      if( nodes[i].x ){
        // skip (old) nodes that already have a position
        continue
      }
      nodes[i].x = nodes[i].px =
        Math.cos( angle * i ) * halfwidth + halfwidth
      nodes[i].y = nodes[i].py =
        Math.sin( angle * i ) * halfwidth + halfheight
    }
  },
  
  arrangeNodes: function(){
    // arrange new nodes in a circle while retaining the previous position of old nodes
    this.arrangeNodesInACircle( this.state.nodes )
    let newNodes = {}
    for( var i in this.state.nodes ){
      newNodes[this.state.nodes[i].uri] = this.state.nodes[i]
    }
    for( var i in this.state.pastNodes ){
      let uri = this.state.pastNodes[i].uri
      if( newNodes[uri] !== undefined ){
        newNodes[uri].x = this.state.pastNodes[i].x
        newNodes[uri].y = this.state.pastNodes[i].y
        newNodes[uri].px = this.state.pastNodes[i].x
        newNodes[uri].py = this.state.pastNodes[i].y
      }
    }
  },

  hideChat: function(e) {
    console.log('hideChat')
    let state = {
      graph: this.state.graph,
      pastNodes: this.state.pastNodes,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: false,
      inboxOpen: this.state.inboxOpen,
      plusDrawerOpen: this.state.plusDrawerOpen,
    }

    this.setState(state)
  },

  togglePlusDrawer: function(e) {
    console.log('togglePlusDrawer')
    let state = {
      graph: this.state.graph,
      pastNodes: this.state.pastNodes,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: this.state.chatOpen,
      inboxOpen: this.state.inboxOpen,
      plusDrawerOpen: !this.state.plusDrawerOpen,
    }

    this.setState(state)
  },

  render: function() {
    return (
      <div id="graph-outer">
        { /* TODO: structure, ids and class names suck*/ }
        <div id="wrapper">
          <div id="plus_button" onClick={this.togglePlusDrawer}/>

          {this.state.plusDrawerOpen ? <PlusDrawer graph={this.state.graph} toggle={this.togglePlusDrawer} addNode={this.addNode} addNodeToInbox={this.addNodeToInbox}/> : ""}

          <Inbox graph={this.state.graph} open={this.state.inboxOpen} nodes={this.state.inboxNodes} addNode={this.addNode}/>


          <div id="graph">
            <div id="chart"/>
          </div>
        </div>
        { this.state.chatOpen ? <Chat graph={this.state.graph} hide={this.hideChat}/> : ""}
      </div>
    )
  }
})


export default Graph
