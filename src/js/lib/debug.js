import debug from 'debug'

debug.log = console.trace.bind(console);

export default debug