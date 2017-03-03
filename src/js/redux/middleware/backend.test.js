/* global describe: true, it: true */
import {expect} from 'chai'
import {stub} from '../../../../test/utils'
import backendMiddleware from './backend'
const middleware = backendMiddleware('dummy backend')

describe('Backend/async Redux middleware', function() {
  it('should handle normal actions correctly', function() {
    const next = stub()
    const handle = middleware({
      dispatch: 'dispatch()',
      getState: 'getState()'
    })(next)
    const action = {type: 'test action'}
    handle(action)
    expect(next.called).to.be.true
    expect(next.calledWithArgs).to.deep.equal([action])
  })

  it('should handle redux-thunk style actions', function() {
    const next = stub()
    const handle = middleware({
      dispatch: 'dispatch()',
      getState: 'getState()'
    })(next)
    const action = stub()
    handle(action)
    expect(next.called).to.be.false
    expect(action.called).to.be.true
    expect(action.calledWithArgs).to.deep.equal([
      'dispatch()', 'getState()', {backend: 'dummy backend'}
    ])
  })

  it('should handle promise actions that resolve', async function() {
    const next = stub()
    const handle = middleware({
      dispatch: 'dispatch()',
      getState: 'getState()'
    })(next)

    let resolvePromise
    const promise = new Promise((resolve, reject) => {
      resolvePromise = resolve
    })

    const action = {
      types: ['fetching', 'success', 'failure'],
      otherParam: 'anything',
      promise: (backend) => {
        expect(backend).to.equal('dummy backend')
        return promise
      }
    }

    handle(action)
    expect(next.called).to.be.true
    expect(next.calledWithArgs).to.deep.equal([{
      type: 'fetching',
      otherParam: 'anything'
    }])
    expect(resolvePromise).to.not.be.null

    next.called = false
    resolvePromise('data')
    await promise
    expect(next.called).to.be.true
    expect(next.calledWithArgs).to.deep.equal([{
      type: 'success',
      otherParam: 'anything',
      result: 'data'
    }])
  })

  it('should handle promise actions that reject', async function() {
    const next = stub()
    const handle = middleware({
      dispatch: 'dispatch()',
      getState: 'getState()'
    })(next)

    let rejectPromise
    const promise = new Promise((resolve, reject) => {
      rejectPromise = reject
    })

    const action = {
      types: ['fetching', 'success', 'failure'],
      otherParam: 'anything',
      promise: (backend) => {
        expect(backend).to.equal('dummy backend')
        return promise
      }
    }

    handle(action)
    expect(next.called).to.be.true
    expect(next.calledWithArgs).to.deep.equal([{
      type: 'fetching',
      otherParam: 'anything'
    }])
    expect(rejectPromise).to.not.be.null

    next.called = false
    rejectPromise('error')
    try {
      await promise
    } catch (e) {
      // this throws an error that doesn't interest us
    }

    expect(next.called).to.be.true
    expect(next.calledWithArgs).to.deep.equal([{
      type: 'failure',
      otherParam: 'anything',
      error: 'error'
    }])
  })
})
