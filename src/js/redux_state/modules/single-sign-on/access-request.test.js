import {expect} from 'chai'
// import { actions } from './access-request'
// import {stub} from '../../../../../test/utils'
const reducer = require('./access-request').default

describe('# SingleSignOn AccessRequest redux module', () => {
  describe('# Reducer', () => {
    it('should initialize properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal({
        entity: {
          loading: false,
          name: 'SOME COMPANY',
          image: 'img/hover_board.jpg',
          errorMsg: '',
          infoComplete: false,
          claims: {},
          response: {},
          userDid: ''
        }
      })
    })

    // it('should update did on getDid', () => {
    //   const state = reducer(undefined, '@@INIT')
    //   const action = {
    //     type: actions.getDid.id,
    //     did: 'did:jolo:TEST'
    //   }
    //   const expectedState = {
    //     loading: false,
    //     name: 'SOME COMPANY',
    //     image: 'img/hover_board.jpg',
    //     returnURL: '',
    //     infoComplete: false,
    //     claims: {},
    //     response: {},
    //     userDid: 'did:jolo:TEST'
    //   }
    //   expect(reducer(state, action).getIn(['entity']).toJS()).to.deep.equal(expectedState) // eslint-disable-line max-len
    // })

  // describe('# Actions', () => {
    // TODO: on POST to callbackURL success return OK
    // it('grantAccessToRequester should return OK status after PUT', () => {  // eslint-disable-line max-len
    //   const dispatch = stub()
    //   const getState = stub()
    //   const backend = {wallet: {
    //     grantAccessToRequester: stub().returns('PUT request OK')
    //   }}
    //   const thunk = actions.actions.grantAccessToRequester()
    //   thunk(dispatch, getState, {backend})
    //   /* eslint-disable */
    //   expect(dispatch.called).to.be.true
    //   /* eslint-enable */
    //   // expect(dispatch.calls[0].args[0].promise()).to.equal('PUT request OK')
    //   expect(dispatch.calls[0].args[0].types).to.deep.equal([
    //     'single-sign-on/access-request/GRANT_ACCESS_TO_REQUESTER',
    //     'single-sign-on/access-request/GRANT_ACCESS_TO_REQUESTER_SUCCESS', // eslint-disable-line max-len
    //     'single-sign-on/access-request/GRANT_ACCESS_TO_REQUESTER_FAIL' // eslint-disable-line max-len
    //   ])
    // })
  })
})
