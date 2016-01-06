// This component is only meant for test purposes
import React from 'react'
import WebIDAgent from '../lib/agents/webid.js'
import Util from '../lib/util'
import {Parser} from '../lib/rdf'
import {SSN} from '../lib/namespaces'
import N3 from 'n3'

let N3Util = N3.Util
let webidAgent = new WebIDAgent()
let socket = null

/*
 See $REPO_ROOT/kickoff for instructions
*/

let Test = React.createClass({
  getInitialState() {
    return {
      webid: '#',
      sensorUrl: '#',
      measurement: 'n/a',
      measurementDesc: 'n/a'
    }
  },

  parseSensorRDF(response) {
    let parser = new Parser()
    return parser.parse(response)
      .then((result) => {
        let desc = null
        let value = null
        for (var t of result.triples) {
          if (t.predicate == SSN.hasValue) {
            value = N3Util.getLiteralValue(t.object)
          }

          if (t.predicate == SSN.observes) {
            desc = N3Util.getLiteralValue(t.object)
          }
        }

        return {
          value: value,
          description: desc
        }
      })
  },

  componentDidMount() {

    // first derive sensor url from webid
    webidAgent.getWebID()
      .then((webid) => {
        let webidRoot = Util.webidRoot(webid)
        let sensorUrl = `${webidRoot}/little-sister/sensor`
        this.setState({
          webid: webid,
          sensorUrl: sensorUrl,
          measurement: 'n/a',
          measurementDesc: 'n/a'
        })

        // then get the sensor url
        return webidAgent.get(sensorUrl)
      })
      .then((xhr) => {

        // subscribe to live updates of sensor resource
        let wsUrl = xhr.getResponseHeader('Updates-Via')
        socket = new WebSocket(wsUrl)
        let self = this
        socket.onopen = function() {
          this.send(`sub ${self.state.sensorUrl}`)
        }
        socket.onmessage = function(msg) {
          if (msg.data && msg.data.slice(0, 3) === 'pub') {
            // resource updated, refetch resource
            console.log('Measurement updated. Refetching...')
            console.log(msg)
            webidAgent.get(self.state.sensorUrl)
              .then((xhr) => {
                return self.parseSensorRDF(xhr.response)
              })
              .then((parsed) => {
                self.setState({
                  webid: self.state.webid,
                  sensorUrl: self.state.sensorUrl,
                  measurement: parsed.value,
                  measurementDesc: parsed.description
                })
              })
          }
        }

        // initial load of sensor data
        return this.parseSensorRDF(xhr.response)
      })
      .then((parsed) => {
        this.setState({
          webid: this.state.webid,
          sensorUrl: this.state.sensorUrl,
          measurement: parsed.value,
          measurementDesc: parsed.description
        })
      })
  },

  componentWillUmount() {
    if (socket) {
      socket.close()
    }
  },

  render() {
    return (
      <div className="jlc-contacts">
        <h3>WebID: {this.state.webid}</h3>
        <h3>SensorUrl: {this.state.sensorUrl}</h3>
        <h3>Measurement: {this.state.measurement}</h3>
        <h3>Measurement Description: {this.state.measurementDesc}</h3>
      </div>
    )
  }
})

export default Test
