import {expect} from 'chai'
import Immutable from 'immutable'
import {stub} from '../../../test/utils'
import {
  initiate,
  add,
  update,
  submitChanges,
  verify // ,
  // set
} from './edit-contact-util'

describe.only('# Edit contact Util', () => {
  describe('# initiate', () => {
    it('should initiate properly', () => {
      const result = {
        emails: [
          {value: 'test1@test.com', verified: false},
          {value: 'test2@test.com', verified: true}],
        phoneNumbers: [
          {number: '+123456789', type: 'test'}]
      }
      const state = {
        loading: false,
        showErrors: false,
        information: {
          originalInformation: {
            emails: [{
              value: 'test1@test.com', verified: false, delete: false,
              update: false, valid: true
            }, {
              value: 'test2@test.com', verified: true, delete: false,
              update: false, valid: true
            }],
            phoneNumbers: [{
              number: '+123456789', type: 'test', delete: false, update: false,
              valid: true
            }]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
      }
      expect(initiate(result).toJS()).to.deep.equal(state)
    })
  })
  describe('# Add', () => {
    it('should add a new email field', () => {
      const oldState = Immutable.fromJS({
        information: {
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
      })
      const newState = {
        information: {
          newInformation: {
            emails: [{value: '', valid: false, delete: false, blank: true}],
            phoneNumbers: []
          }
        }
      }
      const action = {field: 'emails'}
      expect(add(oldState, action).toJS()).to.deep.equal(newState)
    })
    it('should add a new phone number field', () => {
      const oldState = Immutable.fromJS({
        information: {
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
      })
      const newState = {
        information: {
          newInformation: {
            emails: [],
            phoneNumbers: [{
              value: '', type: 'home', valid: false, delete: false, blank: true
            }]
          }
        }
      }
      const action = {field: 'phoneNumbers'}
      expect(add(oldState, action).toJS()).to.deep.equal(newState)
    })
  })
  describe('# Update', () => {
    it('should do nothing if the email is verified', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [{
              value: 'test@test.com', verified: true, delete: false,
              update: true, valid: false, blank: false
            }],
            phoneNumbers: []
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          },
          showErrors: false
        }
      })
      const action = {field: 'emails', value: 'test2@test.com', index: 0}
      expect(update(state, action)).to.deep.equal(state)
    })
    it('should do nothing if the phone number is verified', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [],
            phoneNumbers: [{
              value: '123456789', type: 'home', verified: true, delete: false,
              update: true, valid: false, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          },
          showErrors: false
        }
      })
      const action = {field: 'phoneNumbers', index: 0, value: {
        number: '+123456789',
        type: 'test'
      }}
      expect(update(state, action).toJS()).to.deep.equal(state.toJS())
    })
    it('should update correctly a non verified phone number', () => {
      const oldState = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [],
            phoneNumbers: [{
              value: '123456789', type: 'home', verified: false, delete: false,
              update: true, valid: false, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          },
          showErrors: false
        }
      })
      const action = {field: 'phoneNumbers', index: 0, value: {
        number: '+123456789',
        type: 'test'
      }}
      const newState = {
        information: {
          originalInformation: {
            emails: [],
            phoneNumbers: [{
              value: '+123456789', type: 'test', verified: false, delete: false,
              update: true, valid: true, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          },
          showErrors: false
        }
      }
      expect(update(oldState, action).toJS()).to.deep.equal(newState)
    })
    it('should update correctly a non verified phone number', () => {
      const oldState = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [{
              value: 'test1@test.com', verified: false, delete: false,
              update: true, valid: true, blank: false
            }],
            phoneNumbers: []
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          },
          showErrors: false
        }
      })
      const action = {field: 'emails', index: 0, value: 'test2@test.com'}
      const newState = {
        information: {
          originalInformation: {
            emails: [{
              value: 'test2@test.com', verified: false, delete: false,
              update: true, valid: true, blank: false
            }],
            phoneNumbers: []
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          },
          showErrors: false
        }
      }
      expect(update(oldState, action).toJS()).to.deep.equal(newState)
    })
  })
  describe('# Verify', () => {
    it('should return an error for a non valid', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [],
            phoneNumbers: [{
              verified: true, delete: false, update: false, valid: false,
              blank: false
            }, {
              verified: true, delete: true, update: false, valid: false,
              blank: false
            }]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          },
          showErrors: false
        }
      })
      expect(verify(state).toJS().showErrors).to.be.true
    })
    it('should not return an error for a valid field', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [
              {verified: false, delete: true, update: true, valid: false},
              {verified: false, delete: false, update: true, valid: true}],
            phoneNumbers: [
              {verified: false, delete: false, update: true, valid: true},
              {verified: false, delete: false, update: true, valid: true}]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          },
          showErrors: false
        }
      })
      expect(verify(state).toJS().showErrors).to.be.false
    })
    it('should return an error when updating a verified field', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [
              {verified: true, delete: false, update: true, valid: false,
                blank: false
              }, {verified: false, delete: true, update: true, valid: false,
                blank: false
              }, {verified: false, delete: false, update: true, valid: true,
                blank: false
              }],
            phoneNumbers: [{
              verified: false, delete: true, update: true, valid: false,
              blank: false
            }, {verified: false, delete: false, update: true, valid: true,
              blank: false
            }]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          },
          showErrors: false
        }
      })
      expect(verify(state).toJS().showErrors).to.be.true
    })
    it('should return an error if a new value is not valid', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [
              {verified: false, delete: false, update: true, valid: false,
                blank: false
              }, {verified: false, delete: true, update: true, valid: false,
                blank: false
              }, {verified: false, delete: false, update: true, valid: true,
                blank: false
              }],
            phoneNumbers: [{
              verified: false, delete: true, update: true, valid: false,
              blank: false
            }, {verified: false, delete: false, update: true, valid: true,
              blank: false
            }]
          },
          newInformation: {
            emails: [{blank: false, valid: false, delete: false}],
            phoneNumbers: []
          },
          showErrors: false
        }
      })
      expect(verify(state).toJS().showErrors).to.be.true
    })
    it('should not return an error if a new value is valid', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [
              {verified: false, delete: false, update: true, valid: false,
                blank: false
              }, {verified: false, delete: true, update: true, valid: false,
                blank: false
              }, {verified: false, delete: false, update: true, valid: true,
                blank: false
              }],
            phoneNumbers: [{
              verified: false, delete: true, update: true, valid: false,
              blank: false
            }, {verified: false, delete: false, update: true, valid: true,
              blank: false
            }]
          },
          newInformation: {
            emails: [{
              value: 'test3@test.com', blank: false, valid: true, delete: false
            }],
            phoneNumbers: []
          },
          showErrors: false
        }
      })
      expect(verify(state).toJS().showErrors).to.be.false
    })
  })
  describe('# submitChanges', () => {
    describe('# Email', () => {
      it('should set a new valid email value', () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [],
            phoneNumbers: []
          },
          newInformation: {
            emails: [{
              value: 'test3@test.com', blank: false, valid: true, delete: false
            }],
            phoneNumbers: []
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.true
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.false
      })
      it('should not set a new non valid email value', () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [],
            phoneNumbers: []
          },
          newInformation: {
            emails: [{
              value: 'test3@test.com', blank: false, valid: false, delete: false
            }],
            phoneNumbers: []
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.false
      })
      it('should update a non verified valid email value', () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [{
              value: 'test@test.com', verified: false, delete: false,
              update: true, valid: true, blank: false
            }],
            phoneNumbers: []
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.true
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.false
      })
      it('should not update a non verified email with a non valid value',
      () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [{
              value: 'test@testcom', verified: false, delete: false,
              update: true, valid: false, blank: false
            }],
            phoneNumbers: []
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.false
      })
      it('should not update a verified email', () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [{
              value: 'test@testcom', verified: true, delete: false,
              update: true, valid: true, blank: false
            }],
            phoneNumbers: []
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.false
      })
      it('should delete a deleted phone number', () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [{
              value: 'test1@test.com', verified: false, delete: true,
              update: false, valid: true
            }],
            phoneNumbers: []
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.true
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.false
      })
    })
    describe('# Phone Number', () => {
      it('should set a new valid phone number value', () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [],
            phoneNumbers: []
          },
          newInformation: {
            emails: [],
            phoneNumbers: [{
              value: '0123456', type: 'test', blank: false, valid: true,
              delete: false
            }]
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.true
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.false
      })
      it('should not set a new non valid phone number value', () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [],
            phoneNumbers: []
          },
          newInformation: {
            emails: [],
            phoneNumbers: [{
              value: '012x3456', type: 'test', blank: false, valid: false,
              delete: false
            }]
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.false
      })
      it('should update a non verified valid phone number value', () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [],
            phoneNumbers: [{
              value: '123456', type: 'home', verified: false, delete: false,
              update: true, valid: true, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.true
        expect(deletePhone.called).to.be.false
      })
      it('should not update a non verified phone number with a non valid value',
      () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [],
            phoneNumbers: [{
              value: '123456', type: 'home', verified: true, delete: false,
              update: true, valid: false, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.false
      })
      it('should not update a verified valid phone number value', () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [],
            phoneNumbers: [{
              value: '123456', type: 'home', verified: true, delete: false,
              update: true, valid: true, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.false
      })
      it('should delete a deleted phone number', () => {
        const setEmail = stub()
        const deleteEmail = stub()
        const updateEmail = stub()
        const setPhone = stub()
        const deletePhone = stub()
        const updatePhone = stub()
        const wallet = {
          setEmail, deleteEmail, updateEmail, setPhone, deletePhone, updatePhone
        }
        const backend = {wallet}
        const state = {
          originalInformation: {
            emails: [],
            phoneNumbers: [{
              value: '123456789', verified: false, delete: true,
              update: false, valid: true
            }]
          },
          newInformation: {
            emails: [],
            phoneNumbers: []
          }
        }
        submitChanges(backend, state)
        expect(setEmail.called).to.be.false
        expect(updateEmail.called).to.be.false
        expect(deleteEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updatePhone.called).to.be.false
        expect(deletePhone.called).to.be.true
      })
    })
  })
})
