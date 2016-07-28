import sinon from 'sinon'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

chai.use(chaiEnzyme())

global.chai = chai
global.sinon = sinon
global.expect = chai.expect
global.should = chai.should()

const context = require.context('../src/js', true, /.*\.js$/)
context.keys().forEach(context)
