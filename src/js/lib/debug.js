import debug from 'debug'
import {flow, map} from 'lodash/fp'

debug.log = console.trace.bind(console)

// Prints an array of triples using console.table
console.rdftable = (array) => {
  flow(
      map((statement) => ({
        subject: statement.subject.uri || statement.subject.value,
        predicate: statement.predicate.uri.split("/").slice(-1)[0],
        object: statement.object.uri || statement.object.value
      })),
      console.table.bind(console))
  (array)
}

export default debug