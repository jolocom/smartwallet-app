import {expect} from 'chai'
const reducer = require('./country-select').default
import * as actions from './country-select'

describe('# Country Select redux module', () => {
  it('should initiate properly', () => {
    const state = reducer(undefined, actions.setCountryType('country'))
    expect(state.get('type')).to.equal('country')
  })
  it('should set country value properly', () => {
    const state = reducer(undefined, actions.setCountryValue('test'))
    expect(state.toJS()).to.deep.equal({
      value: 'test',
      age: '',
      returnUrl: '',
      index: '',
      options: [],
      type: ''
    })
  })
  it('should return the initial state on clearState', () => {
    const state = reducer(undefined, actions.setCountryValue('test'))
    expect(reducer(state, actions.clearState()).toJS())
      .to.deep.equal(actions.initialState.toJS())
  })
})
