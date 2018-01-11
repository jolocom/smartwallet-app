import {expect} from 'chai'
import { actions } from './access-request'
import {stub} from '../../../../../test/utils'
const reducer = require('./access-request').default

describe('# SingleSignOn AccessRequest redux module', () => {
  describe('# Reducer', () => {
    it('should initialize properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal({
        entity: {
          loading: false,
          path: '',
          name: 'SOME COMPANY',
          image: 'img/hover_board.jpg',
          requester: '',
          returnURL: '',
          fields: [],
          infoComplete: false
        }
      })
    })

    it('should update loading, requester, returnURL and fields array on requestedDetails', () => { // eslint-disable-line max-len
      const state = reducer(undefined, '@@INIT')
      const action = {
        type: actions.requestedDetails.id,
        details: {
          loading: true,
          pathname: '/single-sign-on/test',
          query: {
            requester: 'www.test.com',
            returnURL: 'www.return.com',
            'scope[]': ['phone', 'email']
          }
        }
      }
      const expectedState = {
        loading: true,
        path: '/single-sign-on/testundefined',
        name: 'SOME COMPANY',
        image: 'img/hover_board.jpg',
        requester: 'www.test.com',
        returnURL: 'www.return.com',
        fields: ['phone', 'email'],
        infoComplete: false
      }
      expect(reducer(state, action).getIn(['entity']).toJS()).to.deep.equal(expectedState) // eslint-disable-line max-len
    })

    it('should update company name in state after GET request', () => {
      let state = reducer(undefined, '@@INIT')

      const action = {
        type: actions.getRequesterIdentity.id_success,
        result: {value: 'test company'}
      }
      state = reducer(state, action)
      expect(state.getIn(['entity']).toJS()).to.deep.equal({
        loading: false,
        path: '',
        name: 'test company',
        image: 'img/hover_board.jpg',
        requester: '',
        returnURL: '',
        fields: [],
        infoComplete: false
      })
    })

    it('should update loading to false at success of grantAccessToRequester', () => { // eslint-disable-line max-len
      let state = reducer(undefined, '@@INIT')

      const action = {
        type: actions.grantAccessToRequester.id_success,
        loading: false
      }
      state = reducer(state, action)
      expect(state.getIn(['entity']).toJS()).to.deep.equal({
        loading: false,
        path: '',
        name: 'SOME COMPANY',
        image: 'img/hover_board.jpg',
        requester: '',
        returnURL: '',
        fields: [],
        infoComplete: false
      })
    })
  })

  describe('# Actions', () => {
    it('grantAccessToRequester should return OK status after PUT', () => {  // eslint-disable-line max-len
      const dispatch = stub()
      const getState = stub()
      const backend = {wallet: {
        grantAccessToRequester: stub().returns('PUT request OK')
      }}
      const thunk = actions.actions.grantAccessToRequester()
      thunk(dispatch, getState, {backend})
      expect(dispatch.called).to.be.true
      // expect(dispatch.calls[0].args[0].promise()).to.equal('PUT request OK')
      expect(dispatch.calls[0].args[0].types).to.deep.equal([
        '/single-sign-on/access-request/GRANT_ACCESS_TO_REQUESTER',
        '/single-sign-on/access-request/GRANT_ACCESS_TO_REQUESTER_SUCCESS', // eslint-disable-line max-len
        '/single-sign-on/access-request/GRANT_ACCESS_TO_REQUESTER_FAIL' // eslint-disable-line max-len
      ])
    })

    it('getRequesterIdentity should return name of requester', () => {
      const dispatch = stub()
      const getState = stub()
      const backend = {wallet: {
        getRequesterIdentity: stub().returns('foo')
      }}
      const thunk = actions.getRequesterIdentity()
      thunk(dispatch, getState, {backend})
      expect(dispatch.called).to.be.true
      // expect(dispatch.calls[0].args[0].promise()).to.equal('foo')
      expect(dispatch.calls[0].args[0].types).to.deep.equal([
        '/single-sign-on/access-request/GET_REQUESTER_IDENTITY', // eslint-disable-line max-len
        '/single-sign-on/access-request/GET_REQUESTER_IDENTITY_SUCCESS', // eslint-disable-line max-len
        '/single-sign-on/access-request/GET_REQUESTER_IDENTITY_FAIL' // eslint-disable-line max-len
      ])
    })
  })
})
