import React from 'react/addons'

import url from 'url'
import d3 from 'd3'
import N3 from 'n3'
import D3Converter from '../lib/d3-converter.js'
import WebAgent from '../lib/web-agent.js'

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
}

// some style variables - should move them out of here
let jolocom = {};
jolocom.style = {
  width: window.innerWidth,
  height: window.innerHeight,
  light_gray_color: "#efeeee",
  gray_color: "#838383",
  light_blue_color: "#99D7F7",
  blue_color: "#009FE3",
  hilight_color: "#9BD161",
  node_transition_duration: 400
}
jolocom.style.small_node_size = jolocom.style.width / 4.7;
jolocom.style.large_node_size = jolocom.style.width * .5;

//TODO: 
// - underscore to camel case
// - remove semi-colons
// - get rid of jquery
// - simplify
// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/


class D3Graph {

  constructor(el, props, state) {
    // the node being centered (target of 'connect' interactions)
    this.the_perspective = {
      uri: "",
      node: {
        px: jolocom.style.width / 2,
        py: jolocom.style.height / 2
      },
      dom: {}
    }

      // the node showing the large preview circle
    this.the_preview = {
      uri: "",
      node: {}
    }

    this.nodeHistory = []

    this.newNodeURI = null

    // TODO: how many height/width vars do we have?
    this.w = document.getElementById("chart").offsetWidth;
    this.h = document.getElementById("chart").offsetHeight;

    this.svg = d3.select("#chart").append("svg:svg")
      .attr("width", this.w)
      .attr("height", this.h)
      .attr("pointer-events", "all");

    this.vis = this.svg
      .append('svg:g')
    //.call(d3.behavior.zoom().on("zoom", redraw))
    //.append('svg:g');
      
    //background rectangle
    this.vis.append('svg:rect')
      .attr('width', this.w)
      .attr('height', this.h)
      .attr('fill', 'white');

    //background circle
    this.vis.append( "svg:circle" )
      .attr( "class", "plate" )
      .attr( "cx", jolocom.style.width * 0.5 )
      .attr( "cy", jolocom.style.height * 0.5)
      .attr( "r", jolocom.style.width * 0.3 )
      .style( "fill", jolocom.style.light_gray_color );


    // `base` only needs to run once
  	this.force = d3.layout.force();
  	this.force
      .nodes(state.nodes)
  	  .links(state.links)
  	  .gravity(0.2)
  	  .charge( jolocom.style.width * -14)
  	  .linkDistance( jolocom.style.width / 3 )
  	  .size([this.w, this.h])
      .start();

    //group links (so they don't overlap nodes)
    this.link_group = this.vis.append( "g" ).attr( "class", "link_group");
  
  }

  update(el, state) {
  	this.force
      .nodes(state.nodes)
  	  .links(state.links)
      .start();
  
    // --------------------------------------------------------------------------------
    // links
  
    // data binding
    this.link_group.selectAll("g.link").remove(); // remove old links entirely
  	var link = this.link_group.selectAll("g.link")
  	  .data(state.links, (d) => {
        // this retains link-IDs over changing target/source direction
        // NB: not really useful in our case
        var first = this.stringMin( d.source.uri, d.target.uri );
        var last = this.stringMax( d.source.uri, d.target.uri );
        return first + last;
      });
  
    // only new links
    var link_new = link.enter()
      .append("svg:g").attr("class", "link")
  	  .call(this.force.drag);
  
    console.log( "NEW LINKS", link_new[0].length );
  
    // add line
  	link_new.append("svg:line")
  	  .attr("class", "link")
      .attr("stroke-width", jolocom.style.width / 45 )
  	  .attr("stroke", jolocom.style.light_gray_color ) //TODO(philipp) reverse
  	  .attr("x1", function(d){return d.x1})
  	  .attr("y1", function(d){return d.y1})
  	  .attr("x2", function(d){return d.x1})
  	  .attr("y2", function(d){return d.y2});
  
    // remove old links
    var link_old = link.exit();
    console.log( "OLD LINKS", link_old[0].length );
    link_old.transition().duration(2000).style("opacity", 0 ).remove();
  
    // --------------------------------------------------------------------------------
    // nodes
  	var node = this.vis.selectAll("g.node")
  	  .data(state.nodes, function(d){ return d.uri; });
  
    var node_new = node.enter().append("svg:g")
  	  .attr("class", "node")
  	  .attr("dx", "80px")
  	  .attr("dy", "80px")
      .call( this.force.drag );
  
    node_new.style( "opacity", 0 )
      .transition()
      .style( "opacity", 1 )
  
    console.log( "NEW NODES", node_new[0].length );
  
    // add circle
  	node_new.filter(function(d){return d.type == "uri"})
  	  .append("svg:circle")
  	  .attr("class", "node")
  	  .attr("r", jolocom.style.small_node_size/2)
  	  .attr("x", "-8px")
  	  .attr("y", "-8px")
  	  .attr("width", jolocom.style.small_node_size)
  	  .attr("height", jolocom.style.small_node_size)
  	  .style("fill", jolocom.style.gray_color)
  	  .style("stroke", "white")
      .style( "stroke-width", 0 );
  
    // add title text (visible when not in preview)
  	var wrappedTitles = node_new.filter(function(d){return d.type == "bnode" || d.type == "uri"})
      .append("svg:text")
  	  .attr("class", "nodetext")
      .style( "fill", "#ffffff" )
      .attr("text-anchor", "middle" )
  	  .attr("dy", ".35em")
  	  .text(function(d) { return d.title })
      .call( this.wrap, jolocom.style.small_node_size * 0.9, "", "" ); // returns only wrapped titles, so we can push them up later
  
    // remove old nodes
    var node_old = node.exit();
    console.log( "OLD NODES", node_old[0].length );
    node_old.transition()
      .style("opacity", 0 )
      .remove();
  
    // NB(philipp): on init, the `fixed`-attribute of nodes is cleared
    // and needs to be re-set. also, the asynchronous call to init can interrupt
    // the animation, so it is also re-started.
  
    { // init center perspective
      this.the_perspective.node = state.nodes[0];
      this.the_perspective.uri = state.nodes[0].uri;
      this.the_perspective.node.fixed = true;
      if( this.firstInit ){ // don't animate on very first init
        //gone
        
      } else {
        this.animateNode( this.the_perspective.node,
                     jolocom.style.width / 2,
                     jolocom.style.height / 2 );
      }
      this.getCenterNode( node )
        .select( "circle" )
        .style("fill", jolocom.style.blue_color );
    }
  
    { // init history
      if( this.nodeHistory.length > 0 ){
        var lastStep = state.nodes.filter( function(d) {
          return d.uri == this.nodeHistory[ this.nodeHistory.length - 1 ].uri; })[0];
        lastStep.fixed = true;
        this.animateNode( lastStep,
                     jolocom.style.width / 2,
                     jolocom.style.height * 4/5 );
      }
    }
  
    { // init new node, if applicable
      if( this.newNodeURI !== undefined ){
        var newNode = node.filter((d) => d.uri == this.newNodeURI)
        if( newNode.length > 0 ){
          newNode
            .interrupt()
            .style( "opacity", 1 )
            .select( "circle" )
            .style( "fill", jolocom.style.hilight_color );
          newNode
            .transition().duration( 2000 )
            .style( "fill", jolocom.style.gray_color );
        };
        this.newNodeURI = undefined;
      };
    }
  
    { // init preview
      this.disablePreview( node );
      this.enablePreview( this.getCenterNode( node ) );
    }
  
    // --------------------------------------------------------------------------------
    // animation
  	var ticks = 0;
  
  	this.force.on("tick", function(e) {
  	  ticks++;
      // NOTE(philipp) uncomment this to 'freeze' graph while dragging
  	  //if( drag.active ){ return; }
  
      // NOTE(philipp): keep going even after 300+ ticks. rock on!
  		// if (ticks > 300) {
  		// 	force.stop();
  		// 	force.charge(0)
  		// 	  .linkStrength(0)
  		// 	  .linkDistance(0)
  		// 	  .gravity(0);
  		// 	force.start();
  		// }
  
  		link.selectAll("line.link")
        .attr("x1", function(d) { return d.source.x; })
  		  .attr("y1", function(d) { return d.source.y; })
  		  .attr("x2", function(d) { return d.target.x; })
  		  .attr("y2", function(d) { return d.target.y; });
  
  		node
        .attr("transform", function(d){
          // shift nodes _towards_ x center and _away_ from y center
          // (so they sit nicely on top & below the center perspective)
          var kx = 10 * e.alpha;
          var ky = 4 * kx
          d.x += (d.x < ( jolocom.style.width / 2 ))  ?( kx ):( -kx );
          d.y += (d.y < ( jolocom.style.height / 2 )) ?( -ky ):( ky );
          return "translate(" + d.x + "," + d.y + ")";
        });
  	});

    // -----------------------------------------------------------------------------
    // helper functions
    let self = this
  
    var taptimer = {
      start: 0,
      end: 0
    };
  
    // touchStart and touchEnd are logging tap-times
    let tapStart = function() {
      taptimer.start = d3.event.sourceEvent.timeStamp;
    };
  
    let tapEnd = function(){
      taptimer.end = d3.event.sourceEvent.timeStamp;
      if(( taptimer.end - taptimer.start ) < 200 ){
        return true;
      };
      return false;
    };
  
    let openPreview = function (d){ // click == enable preview
      if( d.uri == self.the_preview.uri ) return;
      self.disablePreview( node );
      self.the_preview.node = d;
      self.the_preview.uri = d.uri;
      self.enablePreview( d3.select( this ));
    };
  
    var drag = {
      active: false,
      starttime: 0,
      endtime: 0,
      onCenter: false,
      startPos: {},
      nowPos: {},
      distance: function(){
        console.log('hi there')
        console.log(drag)
        return self.distance( drag.startPos.x,
                         drag.startPos.y,
                         drag.nowPos.x,
                         drag.nowPos.y );
      }
    }
  
    let dragStart = function (d){
      tapStart();
      console.log( "dragStart" );
      console.log(d3.event)
      //if(d3.event.sourceEvent.touches){
        drag.active = true;
        drag.startPos.x = drag.nowPos.x = d3.event.sourceEvent.pageX;
        drag.startPos.y = drag.nowPos.y = d3.event.sourceEvent.pageY;
        //drag.start = d3.event.sourceEvent.timeStamp;
        if( d.uri == self.the_perspective.uri ){
          drag.onCenter = true;
          window.setTimeout( triggerLongTap, 800 );
        } else {
          drag.onCenter = false;
        }
        //force.stop();
        //d3.event.preventDefault();
      //}
    };
  
    let triggerLongTap = function (){
      console.log( "longtap triggered (by timeout)" );
      if( !drag.active ) return; // drag event stopped before timeout expired
      if( drag.distance() > 40 ){
        inbox.open();
      };
    };
  
    let dragMove = function (d){ // TODO
      console.log( "dragmove" );
      if( d == self.the_perspective.node ){ // center node grabbed
        drag.nowPos.x = d3.event.sourceEvent.pageX;
        drag.nowPos.y = d3.event.sourceEvent.pageY;
      } else {
        //d.fixed = true;
      }
    };
  
    let dragEnd = function (d){
      console.log( "dragEnd" );
      console.log(d3.event)
      drag.active = false;
      if( tapEnd() || d3.event.defaultPrevented ){
        // this is a click
        return;
      };
      if( d == self.the_perspective.node ){
        // reset node position
        d.x, d.px = jolocom.style.width / 2;
        d.y, d.py = jolocom.style.height / 2;
        d3.select( this ).attr( "transform", function(d){
          return "translate(" + d.x + "," + d.y + ")";
        });
        // perspective node can be dragged into inbox (top of screen)
        console.log(d3.event)
        var y = d3.event.sourceEvent.pageY; // NOTE(philipp): d3.touches[0][1] won't work (because there are no _current_ touches)
        console.log(drag.distance())
        if( drag.distance() < 40 ){
          //TODO: change chat state to "showing"
          chat.show();
        } else if( y < jolocom.style.height / 3 ){

          //TODO: should communicate back to react
          self.inbox.add( d );
        }
      } else {
        // surrounding nodes can be dragged into focus (center of screen)
        if( self.distance( d.x,
                      d.y,
                      jolocom.style.width / 2,
                      jolocom.style.height / 2 )
            < jolocom.style.width * (3/8)){
          console.log('changing center')
          self.changeCenter( d, d3.select( this ), node);
          self.disablePreview( node );
          self.the_preview.node = d;
          self.the_preview.uri = d.uri;
          self.enablePreview( d3.select( this ));
        }
      }

      //TODO: change inbox state to "closed"
      self.inbox.close();
    };

    // --------------------------------------------------------------------------------
    // interaction
    //NOTE(philipp): if necessary, use `mobilecheck` to assign different events for mobile and desktop clients
    node.on( "click", null ); // NOTE(philipp): unbind old `openPreview` because it captured the  outdated `node` variable
    node.on( "click", openPreview );

    
  
    this.force.drag()
      .on( "dragstart", dragStart )
      .on( "drag", dragMove )
      .on( "dragend", dragEnd );
  
    this.force.start();
  
  }

  destroy(el) {
    //empty
  }


  // graph zoom/scale
  zoomTo(scale, x, y) {
    this.vis.transition()
      .attr("transform", "scale( "+ scale + " ) translate(" + x + "," + y + ")");
  }

  zoomReset() {
    this.vis.transition()
      .attr("transform", "scale( 1 ) translate( 0, 0 )" );
  }


  animateNode( d, x, y ) {
    // http://stackoverflow.com/questions/19931383/animating-elements-in-d3-js
    d3.select(d).transition().duration( 1000 )
      .tween("x", function() {
        var i = d3.interpolate(d.x, x);
        return function(t) {
          d.x = i(t);
          d.px = i(t);
        };
      }).tween("y", function() {
        var i = d3.interpolate(d.y, y);
        return function(t) {
          d.y = i(t);
          d.py = i(t);
        };
      });
  }

  changeCenter(d, dom, node){
    // update center perspective
    { // treat old center & update node history
      var oldCenter = {
        dom: this.getCenterNode( node ),
        uri: this.the_perspective.uri,
        node: this.the_perspective.node
      };
      //oldCenter.node.fixed = false;
      oldCenter.dom
        .select( "circle" )
        .style( "fill", jolocom.style.light_blue_color );
      this.animateNode( oldCenter.node,
                   jolocom.style.width / 2,
                   jolocom.style.height * 4/5 );
      this.nodeHistory.push( oldCenter );
      if( this.nodeHistory.length > 1 ){
        var historic = this.nodeHistory[ this.nodeHistory.length - 2 ];
        historic.node.fixed = false;
        historic.dom
          .select( "circle" )
          .style( "fill", jolocom.style.gray_color );
      }
    }
    { // assign & treat new center
      this.the_perspective.node = d;
      this.the_perspective.uri = d.uri;
      this.the_perspective.dom = this.getCenterNode( node );
      this.the_perspective.node.fixed = true;
      this.animateNode( this.the_perspective.node,
                   jolocom.style.width / 2,
                   jolocom.style.height / 2 ); // move to center
      this.the_perspective.dom
        .select( "circle" )
        .style("fill", jolocom.style.blue_color );
    }
  
    // Communicate graph state to react
    // TODO: rethink
    //$("#graph-url").val(d.uri).trigger("click");
  
    this.force.start();
  }

  enrich( less, more ){
    // add any missing keys of `more` to `less`
    for( var k in more ){
      if(( more.hasOwnProperty( k )) && ( less[ k ] == undefined )){
        less[ k ] = more[ k ];
      }
    }
  }

  addNode( node ) {
    // @Justas: this pushes fake node & connections into d3
    // and is called by the 'plus'-button and the 'inbox' (see `./mobile-js/mobile.js`)
    var fullNode = {
      description: "A New Node",
      fixed: false,
      index: this.nodes.length,
      name: undefined, //"https://test.jolocom.com/2013/groups/moms/card#g",
      px: jolocom.style.width / 2, //undefined, //540,
      py: jolocom.style.height * 3/4, //undefined, //960,
      title: "NewNode",
      type: "uri",
      uri: "fakeURI" +( Math.random() * Math.pow( 2, 32 )), //"https://test.jolocom.com/2013/groups/moms/card#g",
      weight: 5,
      x: undefined, //539.9499633771337,
      y: undefined, //960.2001464914653
    };
    if( node == undefined ){
      node = fullNode
    } else {
      enrich( node, fullNode );
    }
    link = { source: node,
             target: the_perspective.node };
    // fakeURI works for the current session- we don't have the new URI anyway
  //  jolocom.start.createAndConnectNode(node.title, node.description, miscContainer, the_perspective.node.uri)
    $('#node-connect').val(node.title + '|' + node.description + '|' + the_perspective.node.uri).trigger('click');
  
  //TODO: light up the new node as before
    // go go go
  //  links.push( link );
  //  nodes.push( node );
  //  newNodeURI = node.uri; // remember the URI so we can light the node up on init
  //  init();
  }

  getCenterNode( allNodes ) {
    return allNodes.filter((d) => d.uri == this.the_perspective.uri)
  }

  // http://bl.ocks.org/mbostock/7555321
  wrap(text, width, separator, joiner) {
    if( separator == undefined ){
      separator = /\s+/;
      joiner = " ";
    }
    var hasWrapped = [];
    text.each(function() {
      var text = d3.select(this),
      words = text.text().split( separator ).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join( joiner ));
        if (tspan.node().getComputedTextLength() > width) {
          hasWrapped.push( this );
          line.pop();
          tspan.text(line.join( joiner ));
          line = [word];
          lineNumber++;
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", ((lineNumber==0)?(dy+"em"):(lineHeight+"em"))) //++lineNumber * lineHeight + dy + "em") NOTE(philipp): dy is relative to previous sibling (== lineheight for all but first line)
            .text(word);
        }
      }
    });
    return hasWrapped;
  }

  disablePreview( allNodes ){
    // resets ALL nodes
    allNodes.select("circle")
      .transition().duration( jolocom.style.node_transition_duration )
      .attr("r", jolocom.style.small_node_size / 2 )
      .style( "stroke-width", 0 );
    allNodes.select( ".nodetext" )
      .transition().duration( jolocom.style.node_transition_duration )
      .style( "opacity", 1 )
    allNodes.selectAll("g.extras")
      .transition().duration( jolocom.style.node_transition_duration )
      .style("opacity", 0 )
      .remove();
  }

  enablePreview( node ){
    node.moveToFront();

    node
      .select("circle") // only current circle
      .transition().duration( jolocom.style.node_transition_duration )
      .attr("r", jolocom.style.large_node_size / 2 )
      .style({ "stroke": "white",
               "stroke-width": jolocom.style.width / 100 });
    node.select( ".nodetext" )
      .transition().duration( jolocom.style.node_transition_duration )
      .style( "opacity", 0 )
    var extras = node.append("svg:g")
      .attr("class", "extras" )
      .style("opacity", 0 );
    extras
      .append( "svg:text" )
      .attr( "class", "preview-title" )
      .attr( "text-anchor", "middle" )
      .attr( "dy", -1.5 ) //(jolocom.style.large_node_size / - 6 )) //(jolocom.style.large_node_size / 18 ))
      .text( function(d){ return d.title; })
      .call( this.wrap, jolocom.style.large_node_size * 0.7, "", "" );
    extras
      .append("svg:text")
      .attr("class", "preview-description")
      .attr("text-anchor", "middle")
      .attr("dy", 1 )
      .text( function(d){ return d.description; })
      .call( this.wrap, jolocom.style.large_node_size * 0.75 );
    extras
      .transition().duration( jolocom.style.node_transition_duration )
      .style( "opacity", 1 );
    return node;
  }

  stringLessThan( s1, s2 ){
    if( s1 < s2 ) return true;
    return false;
  }
  
  stringMin( s1, s2 ){
    if( this.stringLessThan( s1, s2 )) return s1;
    return s2;
  }
  
  stringMax( s1, s2 ){
    if( this.stringLessThan( s1, s2 )) return s2;
    return s1;
  }
  
  distance( x1, y1, x2, y2 ){
    console.log('calculating distance')
    console.log(x1)
    console.log(y1)
    console.log(x2)
    console.log(y2)
    return Math.sqrt( Math.pow(( x1 - x2 ), 2 ) +
                      Math.pow(( y1 - y2 ), 2 ));
  }

}


//console.log(d3g)

let agent = new WebAgent()
let testData = '{"nodes":[{"name":"https://sister.jolocom.com/reederz/profile/card#me","type":"uri","uri":"https://sister.jolocom.com/reederz/profile/card#me","title":"no title","description":"no description"},{"name":"https://sister.jolocom.com/reederz/profile/card#key","type":"uri","uri":"https://sister.jolocom.com/reederz/profile/card#key","title":"no title","description":"no description"}],"links":[{"source":"0","target":"1","name":" http://www.w3.org/ns/auth/cert#key","value":"10"}],"literals":{"https://sister.jolocom.com/reederz/profile/card":[{"p":"http://purl.org/dc/terms/title","o":"WebID profile of Justas Azna","l":"None","d":"http://www.w3.org/2001/XMLSchema#string"}],"https://sister.jolocom.com/reederz/profile/card#key":[{"p":"http://www.w3.org/ns/auth/cert#modulus","o":"a726cd1e3eddccb4c12ebd3d8581ac83bc2913dfb88cf9d939b5eedff88878e95b9bfa278dc4fbcd5dfe7d80ff866844b69af31f30a79822e32841f3e694d75feeaba92ed91b02be46fd3f86bb800d3be222c4cb480ffa05f87f67949f41324cacc4c34ee9d133d19eb61af71ab6d97048af91d357904b1cdec8333affe1f4098cdd6f6ca465bdbae56e0b006557396dc0abb7ed2c4f3a41dd76ef07cfeb8309e80804b0c288e6e847c0b446d112403d77c939c67b30cc99a96cd695c8dbc53a5afe42bf81c53214ace49c2ce6b5dc35a0c5301dca386d9735b6d7f39c5185a6811459446940ec7b5a5050fc22c6f99844a1b9580ff0972049e898d1e16a3373","l":"None","d":"http://www.w3.org/2001/XMLSchema#hexBinary"},{"p":"http://www.w3.org/ns/auth/cert#exponent","o":"65537","l":"None","d":"http://www.w3.org/2001/XMLSchema#int"}],"https://sister.jolocom.com/reederz/profile/card#me":[{"p":"http://xmlns.com/foaf/0.1/mbox","o":"mailto:justas.azna@gmail.com","l":"None","d":"http://www.w3.org/2001/XMLSchema#string"},{"p":"http://xmlns.com/foaf/0.1/name","o":"Justas Azna","l":"None","d":"http://www.w3.org/2001/XMLSchema#string"}]}}';

/*
 
    // inbox
*/

let Inbox = React.createClass({
  render: function() {
    //TODO
  
  },
  getInitialState: function() {
    return {
      isOpen: false,
      count: 0,
      nodes: [],
    }
  },
  enlarge: function(){
    $( "#inbox_large" ).css( "display", "block" );
    self.zoom.to( 0.5,
             jolocom.style.width / 2,
             jolocom.style.height );
  },
  reduce: function(){
    $( "#inbox_large" ).css( "display", "none" );
    self.zoom.reset();
  },
  open: function(){
    if( !inbox.isOpen ){
      d3.select( "#inbox" )
        .transition()
        .style( "right", ( -jolocom.style.width / 2 )+"px");
      self.inbox.isOpen = true;
    }
  },
  close: function(){
    if( self.inbox.isOpen ){
      var size = (self.inbox.count==0)
        ?(-jolocom.style.width)
        :(-jolocom.style.width+(jolocom.style.width/5));
      d3.select( "#inbox" )
        .transition()
        .style( "right", size+"px" );
      self.inbox.isOpen = false;
    }
  },
  spring: function(){
    // a hack for opening it up a bit
    self.inbox.isOpen = true;
    self.inbox.close();
  },
  add: function( d ){
    self.inbox.nodes.push( d );
    self.inbox.count++;
    // @Justas: this creates the DOM for the nodes in the inbox
    $( "#inbox .counter .number" ).text( inbox.count ); // update counter
    if( self.inbox.count == 1 ){ // fade in on first node
      d3.select( "#inbox .counter" )
        .transition()
        .style( "opacity", 1 );
    }
    var div = "<div></div>";
    var node = $( div ).addClass( "node" ).attr( "draggable", "true" );
    node.__index__ = inbox.count - 1;
    var title = $( div ).addClass( "title" ).text( d.title );
    var element = $( div ).addClass( "element" ).append( node ).append( title );
    $( "#inbox_large" ).prepend( element );
    node.on( "click", function(){
      addNode( self.inbox.nodes[ node.__index__ ] ); // `addNode` in `./visualRDF-js/main.js`
      self.inbox.reduce();
    });
  }

})

let PlusDrawer = React.createClass({
  toggleDrawer: function() {
    if( self.plus.drawer ){
      document.getElementsByTagName('body')[0].className = 'closed-drawer';
      d3.select("#plus_drawer")
        .transition()
        .style( "top", jolocom.style.height+"px" );
      self.zoom.reset();
    } else {
      document.getElementsByTagName('body')[0].className = 'open-drawer';
      d3.select("#plus_drawer")
        .transition()
        .style( "top", ( jolocom.style.height / 2 )+"px" );
      self.zoom.to( 0.5,
               jolocom.style.width / 2,
               0 );
    }
    self.plus.drawer = !self.plus.drawer;
  },
  toInbox: function(){
    // @Justas: this adds the (fake) node to the inbox
    self.inbox.add({ title: $( "#plus_drawer .title" ).val(),
                description: $( "#plus_drawer .description" ).val() });
    self.plus.toggleDrawer();
    self.inbox.spring();
  },
  directConnect: function(){
    // @Justas: this adds the (fake) node to the d3.js graph
    // (find `addNode` in `./VisualRDF-js/main.js`)
    self.addNode({ title: $( "#plus_drawer .title" ).val(),
              description: $( "#plus_drawer .description" ).val() });
    self.plus.toggleDrawer();
  },

  getInitialState: function() {
    return {
      drawer: false //rename to "isOpen" or smth similar
    }
  },

  render: function() {
    //TODO
  
  }

})

let Chat = React.createClass({
  // componentDidMount?
  afterLoad: function () {
  
    d3.select( "#chat" )
  	.transition()
  	.style( "top", ( jolocom.style.height / 3 )+ "px");
    self.zoom.to( 0.5,
      jolocom.style.width / 2,
      jolocom.style.height / -6 );
      console.log('chat after load');
      return false;
  },
  show: function() {
    // draw react component for chat by communicating the state to react
    $("#chat-state").val("loaded").trigger("click");
    $("#chat_container").addClass('visible')
    console.log("Chat load");
  },
  hide: function(e) {
    //TODO
    d3.select( "#chat" )
      .transition()
      .style( "top", jolocom.style.height + "px");
    
    self.zoom.reset();
    $("#chat-state").val("unloaded").trigger("click");
    $("#chat_container").removeClass('visible')
    console.log("Chat unload");
  },
  render: function() {
    return (
      <div id="chat">
        { /* TODO: structure, ids and class names suck*/ }
        <div className="close" onClick={this.hide}>x</div>
        <div className="head">
          <h1 className="title">TODO: chat topic goes here</h1>
          <p className="origin">TODO: chat origin goes here</p>
          <div className="message">
            <div className="content">
              <h2>TODO: author goes here</h2>
              <p>TODO: content goes here</p>
            </div>
            <div className="node link"/>
          </div>
          <div className="message">
            <div className="content">
              <h2>TODO: author goes here</h2>
              <p>TODO: content goes here</p>
            </div>
            <div className="node link"/>
          </div>
          <div className="message">
            <div className="content">
              <h2>TODO: author goes here</h2>
              <p>TODO: content goes here</p>
            </div>
            <div className="node link"/>
          </div>
        </div>
        <div className="message new">
          <textarea className="content" value="TODO: Current message"/>
          <div className="node link"/>
          <div className="button" onClick={this.hide}>tell</div>
        </div>
      </div>
    )
  }
})


/*
 Graph state:
 - nodes, links, literals
 - center
 - inbox (fake nodes)
 - chat open?
 - inbox open?
 - plus drawer open?
*/

let Graph = React.createClass({

  getInitialState: function() {
    return {
      graph: null,
      pastNodes: [],
      nodes: [],
      links: [],
      literals: [],
      chatOpen: false,
      plusDrawerOpen: false,
      inboxOpen: false
    }
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
	  let res = this.mergeGraphs(json.nodes, json.links);
    this.arrangeNodes();
    let state = {
      graph: new D3Graph(null, null, this.state),
      pastNodes: [],
      nodes: res.nodes,
      links: res.links,
      literals: res.literals,
      chatOpen: false,
      plusDrawerOpen: false,
      inboxOpen: false
    }

    this.setState(state)

    return
    var webid = null

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

  mergeGraphs: function(newNodes, newLinks) {
    console.log( 'merging' );
    let sIdx, tIdx;
  	for(var i in newLinks){
  		sIdx = newLinks[i].source;
  		tIdx = newLinks[i].target;
      // add if source does not exist
  		if(this.state.nodes.indexOf(newNodes[sIdx]) == -1){
  			this.state.nodes.push(newNodes[sIdx]);
  		}
  		newLinks[i].source = this.state.nodes.indexOf(newNodes[sIdx]);
      // add if target does not exist
  		if(this.state.nodes.indexOf(newNodes[tIdx]) == -1){
  			this.state.nodes.push(newNodes[tIdx]);
  		}
  		newLinks[i].target = this.state.nodes.indexOf(newNodes[tIdx]);
      //
  		this.state.links.push(newLinks[i]);
  	}
    return { nodes: this.state.nodes, links: this.state.links, literals: this.state.literals };
  },

  arrangeNodesInACircle: function( nodes ) {
    var angle = ( 2 * Math.PI )/ nodes.length;
    var halfwidth = ( jolocom.style.width / 2 );
    var halfheight = ( jolocom.style.height / 2 );
    for( var i in nodes ){
      if( nodes[i].x ){
        // skip (old) nodes that already have a position
        continue;
      }
      nodes[i].x = nodes[i].px =
        Math.cos( angle * i ) * halfwidth + halfwidth;
      nodes[i].y = nodes[i].py =
        Math.sin( angle * i ) * halfwidth + halfheight;
    }
  },
  
  arrangeNodes: function(){
    // arrange new nodes in a circle while retaining the previous position of old nodes
    this.arrangeNodesInACircle( this.state.nodes );
    var newNodes = {};
    for( var i in this.state.nodes ){
      newNodes[ this.state.nodes[i].uri ] = this.state.nodes[i];
    }
    for( var i in this.state.pastNodes ){
      var uri = this.state.pastNodes[i].uri;
      if( newNodes[ uri ] !== undefined ){
        newNodes[ uri ].x = this.state.pastNodes[ i ].x;
        newNodes[ uri ].y = this.state.pastNodes[ i ].y;
        newNodes[ uri ].px = this.state.pastNodes[ i ].x;
        newNodes[ uri ].py = this.state.pastNodes[ i ].y;
      }
    }
  },

  toggleDrawer: function(e) {
    //TODO
    console.log('toggleDrawer')
    d3g.plus.toggleDrawer()
  },

  directConnect: function(e) {
    //TODO
    console.log('directConnect')
    d3g.plus.directConnect()
  },

  toInbox: function(e) {
    //TODO
    console.log('toInbox')
    d3g.plus.toInbox()
  },

  inboxEnlarge: function(e) {
    //TODO
    console.log('inboxEnlarge')
    d3g.inbox.enlarge()
  },

  inboxReduce: function(e) {
    //TODO
    console.log('inboxReduce')
    d3g.inbox.reduce()
  },

  render: function() {
    return (
      <div id="graph-outer">
        { /* TODO: structure, ids and class names suck*/ }
        <div id="wrapper">
          <input id="graph-url" type="text" hidden="hidden"/>
          { /* TODO: probably don't need this hidden stuff anymore */ }
          <input id="chat-state" type="text" hidden="hidden"/>

          <div id="plus_button" onClick={this.toggleDrawer}/>
          <div id="plus_drawer" onClick={this.toggleDrawer}>
            <div className="close">x</div>
            <div>
              <textarea className="title" placeholder="Node title" rows="1" cols="50"/>
            </div>
            <div>
              <textarea className="description" placeholder="Node description" rows="5" cols="50"/>
            </div>
            <div className="button direct" onClick={this.directConnect}>Connect Now</div>
            <div className="button inbox" onClick={this.toInbox}>Put Into Inbox</div>
          </div>
          <div id="inbox" draggable="true" onClick={this.inboxEnlarge}>
            <div className="counter">
              <div className="number">1</div>
            </div>
          </div>
          <div id="inbox_large" onClick={this.inboxReduce}>
            <div className="close">x</div>
          </div>
          <div id="graph">
            <div id="chart"/>
          </div>
        </div>
        <div id="chat_container">
          { this.state.chatOpen ? <Chat/> : ""}
        </div>
      </div>
    )
  }
})


export default Graph
