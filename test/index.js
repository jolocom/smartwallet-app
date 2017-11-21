// import sinon from 'sinon'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiEnzyme())
chai.use(chaiAsPromised)

global.chai = chai
// global.sinon = sinon
global.expect = chai.expect
global.should = chai.should()
global.window = {
  scrollTo: () => {}
}

const context = require.context('../src/js', true, /.*\.test\.jsx?$/)
context.keys().forEach(context)
