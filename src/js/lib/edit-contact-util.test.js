import {expect} from 'chai'
import Immutable from 'immutable'
import {stub} from '../../../test/utils'
import {
  mapAccountInformationToState,
  addNewField,
  updateOriginalValue,
  submitChanges,
  validateChanges,
  setNewFieldValue
} from './edit-contact-util'

describe('# Edit contact Util', () => {
  localStorage.setItem('jolocom.webId', 'testuser')
  describe('# mapAccountInformationToState', () => {
    it('should map account information to state properly', () => {
      const result = {
        email: [
          {address: 'test1@test.com', id: 1, verified: false},
          {address: 'test2@test.com', id: 2, verified: true}],
        phone: [
          {number: '+123456789', id: 3, type: 'personal', verified: true}]
      }
      const state = {
        loading: false,
        showErrors: false,
        information: {
          originalInformation: {
            email: [{
              value: 'test1@test.com', id: 1, verified: false,
              delete: false, update: false, valid: true
            }, {
              value: 'test2@test.com', id: 2, verified: true, delete: false,
              update: false, valid: true
            }],
            phone: [{
              value: '+123456789',
              type: 'personal', delete: false,
              update: false, verified: true,
              valid: true, id: 3
            }]
          },
          newInformation: {
            email: [],
            phone: []
          }
        }
      }
      expect(mapAccountInformationToState(result).toJS()).to.deep.equal(state)
    })
  })
  describe('# addNewField', () => {
    it('should add a new email field', () => {
      const oldState = Immutable.fromJS({
        information: {
          newInformation: {
            email: [],
            phone: []
          }
        }
      })
      const newState = {
        information: {
          newInformation: {
            email: [{value: '', verified: false, valid: false, delete: false,
              blank: true}],
            phone: []
          }
        }
      }
      const action = {field: 'email', index: 0}
      expect(addNewField(oldState, action).toJS()).to.deep.equal(newState)
    })
    it('should add a new phone value field', () => {
      const state = Immutable.fromJS({
        information: {
          newInformation: {
            email: [],
            phone: []
          }
        }
      })
      const newState = {
        information: {
          newInformation: {
            email: [],
            phone: [{value: '', type: 'personal', verified: false,
              valid: false, delete: false, blank: true
            }]
          }
        }
      }
      const action = {field: 'phone', index: 0}
      expect(addNewField(state, action).toJS()).to.deep.equal(newState)
    })
  })
  describe('# setNewFieldValue', () => {
    it('should set a new email field value and update its attributes', () => {
      const oldState = Immutable.fromJS({
        information: {
          newInformation: {
            email: [{value: '', verified: false, valid: false, delete: false,
              blank: true}],
            phone: []
          }
        }
      })
      const newState = {
        information: {
          newInformation: {
            email: [{value: 'A', verified: false, valid: false, delete: false,
              blank: false}],
            phone: []
          }
        }
      }
      const action = {field: 'email', value: 'A', index: 0}
      expect(setNewFieldValue(oldState, action).toJS()).to.deep.equal(newState)
    })
    it('should set a new phone field value and update its attributes', () => {
      const oldState = Immutable.fromJS({
        information: {
          newInformation: {
            email: [],
            phone: [{value: '555', type: 'old', verified: false,
              valid: true, delete: false, blank: false}]
          }
        }
      })
      const newState = {
        information: {
          newInformation: {
            email: [],
            phone: [{value: '1', type: 'new', verified: false,
              valid: true, delete: false, blank: false}]
          }
        }
      }
      const action = {field: 'phone', index: 0, value: {
        value: '1', type: 'new'}}
      expect(setNewFieldValue(oldState, action).toJS()).to.deep.equal(newState)
    })
  })
  describe('# Update', () => {
    it('should do nothing if the email is verified', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            email: [{
              value: 'test@test.com', verified: true, delete: false,
              update: true, valid: false, blank: false
            }],
            phone: []
          },
          newInformation: {
            email: [],
            phone: []
          },
          showErrors: false
        }
      })
      const action = {field: 'email', value: 'test2@test.com', index: 0}
      expect(updateOriginalValue(state, action)).to.deep.equal(state)
    })
    it('should do nothing if the phone value is verified', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            email: [],
            phone: [{
              value: '123456789', type: 'personal', verified: true,
              delete: false, update: true, valid: false, blank: false
            }]
          },
          newInformation: {
            email: [],
            phone: []
          },
          showErrors: false
        }
      })
      const action = {field: 'phone', index: 0, value: {
        value: '+123456789',
        type: 'test'
      }}
      expect(updateOriginalValue(state, action).toJS())
        .to.deep.equal(state.toJS())
    })
    it('should update correctly a non verified phone value', () => {
      const oldState = Immutable.fromJS({
        information: {
          originalInformation: {
            email: [],
            phone: [{
              value: '123456789', type: 'personal', verified: false,
              delete: false, update: true, valid: false, blank: false
            }]
          },
          newInformation: {
            email: [],
            phone: []
          },
          showErrors: false
        }
      })
      const action = {field: 'phone', index: 0, value: {
        value: '+123456789',
        type: 'test'
      }}
      const newState = {
        information: {
          originalInformation: {
            email: [],
            phone: [{
              value: '+123456789', type: 'test', verified: false, delete: false,
              update: true, valid: true, blank: false
            }]
          },
          newInformation: {
            email: [],
            phone: []
          },
          showErrors: false
        }
      }
      expect(updateOriginalValue(oldState, action).toJS())
        .to.deep.equal(newState)
    })
    it('should update correctly a non verified email value', () => {
      const oldState = Immutable.fromJS({
        information: {
          originalInformation: {
            email: [{
              value: 'test1@test.com', verified: false, delete: false,
              update: true, valid: true, blank: false
            }],
            phone: []
          },
          newInformation: {
            email: [],
            phone: []
          },
          showErrors: false
        }
      })
      const action = {field: 'email', index: 0, value: 'test2@test.com'}
      const newState = {
        information: {
          originalInformation: {
            email: [{
              value: 'test2@test.com', verified: false, delete: false,
              update: true, valid: true, blank: false
            }],
            phone: []
          },
          newInformation: {
            email: [],
            phone: []
          },
          showErrors: false
        }
      }
      expect(updateOriginalValue(oldState, action).toJS())
        .to.deep.equal(newState)
    })
  })
  describe('# validateChanges', () => {
    it('should return an error for a non valid field', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            email: [],
            phone: [{
              verified: true, delete: false, update: true, valid: false,
              blank: false
            }, {
              verified: true, delete: false, update: true, valid: false,
              blank: false
            }]
          },
          newInformation: {
            email: [],
            phone: []
          },
          showErrors: false
        }
      })
      expect(validateChanges(state).toJS().showErrors).to.be.true
    })
    it('should not return an error for a valid field', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            email: [
              {verified: false, delete: true, update: true, valid: false},
              {verified: false, delete: false, update: true, valid: true}],
            phone: [
              {verified: false, delete: false, update: true, valid: true},
              {verified: false, delete: false, update: true, valid: true}]
          },
          newInformation: {
            email: [],
            phone: []
          },
          showErrors: false
        }
      })
      expect(validateChanges(state).toJS().showErrors).to.be.false
    })
    it('should return an error when updating a verified field', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            email: [
              {verified: true, delete: false, update: true, valid: false,
                blank: false
              }, {verified: false, delete: true, update: true, valid: false,
                blank: false
              }, {verified: false, delete: false, update: true, valid: true,
                blank: false
              }],
            phone: [{
              verified: false, delete: true, update: true, valid: false,
              blank: false
            }, {verified: false, delete: false, update: true, valid: true,
              blank: false
            }]
          },
          newInformation: {
            email: [],
            phone: []
          },
          showErrors: false
        }
      })
      expect(validateChanges(state).toJS().showErrors).to.be.true
    })
    it('should return an error if a new value is not valid', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            email: [
              {verified: false, delete: false, update: true, valid: false,
                blank: false
              }, {verified: false, delete: true, update: true, valid: false,
                blank: false
              }, {verified: false, delete: false, update: true, valid: true,
                blank: false
              }],
            phone: [{
              verified: false, delete: true, update: true, valid: false,
              blank: false
            }, {verified: false, delete: false, update: true, valid: true,
              blank: false
            }]
          },
          newInformation: {
            email: [{blank: false, valid: false, delete: false}],
            phone: []
          },
          showErrors: false
        }
      })
      expect(validateChanges(state).toJS().showErrors).to.be.true
    })
    it('should not return an error if a new value is valid', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            email: [
              {verified: false, delete: false, update: true, valid: true},
              {verified: false, delete: true, update: true, valid: false},
              {verified: false, delete: false, update: true, valid: true}],
            phone: [
              {verified: false, delete: true, update: true, valid: false},
              {verified: false, delete: false, update: true, valid: true}]
          },
          newInformation: {
            email: [{
              value: 'test3@test.com', blank: false, valid: true, delete: false
            }],
            phone: []
          },
          showErrors: false
        }
      })
      expect(validateChanges(state).toJS().showErrors).to.be.false
    })
  })
  describe('# submitChanges', () => {
    describe('# Email', () => {
      it('should set a new valid email value', () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        // const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            email: [],
            phone: []
          },
          newInformation: {
            email: [{
              value: 'test3@test.com', blank: false, valid: true, delete: false
            }],
            phone: []
          }
        }
        submitChanges(backend, {}, state)
        expect(backend.solid.setEmail.called).to.be.true
        expect(updateEntry.called).to.be.false
        expect(deleteEntry.called).to.be.false
      })
      it('should not set a new non valid email value', () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [],
            phone: []
          },
          newInformation: {
            email: [{
              value: 'test3@test.com', blank: false, valid: false, delete: false
            }],
            phone: []
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(updateEntry.called).to.be.false
        expect(deleteEntry.called).to.be.false
      })
      it('should update a non verified valid email value', () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [{
              value: 'test@test.com', verified: false, delete: false,
              update: true, valid: true, blank: false, id: 1
            }],
            phone: []
          },
          newInformation: {
            email: [],
            phone: []
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(updateEntry.calls).to.be.deep
        .equal([{args: ['testuser', 'email', 1, 'test@test.com']}])
        expect(deleteEntry.called).to.be.false
      })
      it('should not update a non verified email with a non valid value',
      () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [{
              value: 'test@testcom', verified: false, delete: false,
              update: true, valid: false, blank: false
            }],
            phone: []
          },
          newInformation: {
            email: [],
            phone: []
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(updateEntry.called).to.be.false
        expect(deleteEntry.called).to.be.false
      })
      it('should not update a verified email', () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [{
              value: 'test@testcom', verified: true, delete: false,
              update: true, valid: true, blank: false
            }],
            phone: []
          },
          newInformation: {
            email: [],
            phone: []
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(updateEntry.called).to.be.false
        expect(deleteEntry.called).to.be.false
      })
      it('should delete a deleted email value', () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [{
              value: 'test1@test.com', verified: false, delete: true,
              update: false, valid: true, id: 1
            }],
            phone: []
          },
          newInformation: {
            email: [],
            phone: []
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(updateEntry.called).to.be.false
        expect(deleteEntry.called).to.be.true
        expect(deleteEntry.calls).to.be.deep
        .equal([{args: ['testuser', 'email', 1]}])
      })
    })
    describe('# Phone', () => {
      it('should set a new valid phone value', () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [],
            phone: []
          },
          newInformation: {
            email: [],
            phone: [{
              value: '0123456', type: 'test', blank: false, valid: true,
              delete: false
            }]
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(setPhone.called).to.be.true
        expect(updateEntry.called).to.be.false
        expect(deleteEntry.called).to.be.false
      })
      it('should not set a new non valid phone value', () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [],
            phone: []
          },
          newInformation: {
            email: [],
            phone: [{
              value: '012x3456', type: 'test', blank: false, valid: false,
              delete: false
            }]
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updateEntry.called).to.be.false
        expect(deleteEntry.called).to.be.false
      })
      it('should update a non verified phone value with a valid value', () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [],
            phone: [{
              value: '123456', type: 'personal', verified: false, delete: false,
              update: true, valid: true, blank: false, id: 1
            }]
          },
          newInformation: {
            email: [],
            phone: []
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(deleteEntry.called).to.be.false
        expect(updateEntry.called).to.be.true
        expect(updateEntry.calls).to.be.deep
        .equal([{args: ['testuser', 'phone', 1, '123456']}])
      })
      it('should not update a non verified phone value with a non valid value',
      () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [],
            phone: [{
              value: '123456', type: 'personal', verified: true, delete: false,
              update: true, valid: false, blank: false
            }]
          },
          newInformation: {
            email: [],
            phone: []
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updateEntry.called).to.be.false
        expect(deleteEntry.called).to.be.false
      })
      it('should not update a verified valid phone value', () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [],
            phone: [{
              value: '123456', type: 'personal', verified: true, delete: false,
              update: true, valid: true, blank: false
            }]
          },
          newInformation: {
            email: [],
            phone: []
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updateEntry.called).to.be.false
        expect(deleteEntry.called).to.be.false
      })
      it('should delete a deleted phone value', () => {
        const setEmail = stub()
        const deleteEntry = stub()
        const updateEntry = stub()
        const setPhone = stub()
        const solid = {setEmail, setPhone, deleteEntry, updateEntry}
        const backend = {solid}
        const state = {
          originalInformation: {
            email: [],
            phone: [{
              value: '123456789', verified: false, delete: true,
              update: false, valid: true, id: 1
            }]
          },
          newInformation: {
            email: [],
            phone: []
          }
        }
        submitChanges(backend, {}, state)
        expect(setEmail.called).to.be.false
        expect(setPhone.called).to.be.false
        expect(updateEntry.called).to.be.false
        expect(deleteEntry.called).to.be.true
        expect(deleteEntry.calls).to.be.deep
        .equal([{args: ['testuser', 'phone', 1]}])
      })
    })
  })
})
