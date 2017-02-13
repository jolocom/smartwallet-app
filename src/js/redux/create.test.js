/* global describe: true, it: true */
// import {expect} from 'chai'
// import {stub} from '../../../test/utils'
import createStore from './create'

describe('Redux store creation', function() {
  it('should correctly set up the store', function() {
    const store = createStore('history', 'http client', undefined)
    store.dispatch({type: 'TEST'})
  })
})
