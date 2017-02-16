require('babel-polyfill')

import sinon from 'sinon'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiEnzyme())
chai.use(chaiAsPromised)

global.chai = chai
global.sinon = sinon
global.expect = chai.expect
global.should = chai.should()

const context = require.context('../src/js', true, /.*\.test\.jsx?$/)
context.keys().forEach(context)
