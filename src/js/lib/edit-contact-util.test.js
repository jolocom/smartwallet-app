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
  const webId = 'testuser'
  describe('# mapAccountInformationToState', () => {
    it('should map account information to state properly', () => {
      const result = {
        email: [
          {address: 'test1@test.com',
            id: 1,
            verified: false
          },
          {address: 'test2@test.com',
            id: 2,
            verified: true
          }
        ],
        phone: [{
          number: '+123456789', id: 3, type: 'personal', verified: true
        }]
      }

      const state = {
        loading: false,
        showErrors: false,
        callback: '/test/test',
        information: {
          originalInformation: {
            emails: [
              {value: 'test1@test.com', id: 1, verified: false,
                delete: false, update: false, valid: true
              },
              {value: 'test2@test.com', id: 2, verified: true, delete: false,
                update: false, valid: true
              }
            ],
            phones: [
              {value: '+123456789',
                type: 'personal', delete: false,
                update: false, verified: true,
                valid: true, id: 3
              }
            ],
            addresses: []
          },
          newInformation: {
            emails: [{delete: true}],
            phones: [{delete: true}],
            addresses: [ {
              streetWithNumber: {value: '', valid: true},
              zip: {value: '', valid: true},
              city: {value: '', valid: true},
              state: {value: '', valid: true},
              country: {value: '', valid: true},
              delete: false,
              blank: true,
              valid: true
            }]
          }
        }
      }
      expect(mapAccountInformationToState('/test/test', result).toJS())
      .to.deep.equal(state)
    })
  })
  describe('# addNewField', () => {
    it('should add a new emails field', () => {
      const oldState = Immutable.fromJS({
        information: {
          newInformation: {
            emails: [],
            phones: []
          }
        }
      })
      const newState = {
        information: {
          newInformation: {
            emails: [{value: '', verified: false, valid: false, delete: false,
              blank: true}],
            phones: []
          }
        }
      }
      const action = {field: 'emails', index: 0}
      expect(addNewField(oldState, action).toJS()).to.deep.equal(newState)
    })
    it('should add a new phones value field', () => {
      const state = Immutable.fromJS({
        information: {
          newInformation: {
            emails: [],
            phones: []
          }
        }
      })
      const newState = {
        information: {
          newInformation: {
            emails: [],
            phones: [{value: '', type: 'personal', verified: false,
              valid: false, delete: false, blank: true
            }]
          }
        }
      }
      const action = {field: 'phones', index: 0}
      expect(addNewField(state, action).toJS()).to.deep.equal(newState)
    })
  })
  describe('# setNewFieldValue', () => {
    it('should set a new emails field value and update its attributes', () => {
      const oldState = Immutable.fromJS({
        information: {
          newInformation: {
            emails: [{value: '', verified: false, valid: false, delete: false,
              blank: true}],
            phones: []
          }
        }
      })
      const newState = {
        information: {
          newInformation: {
            emails: [{value: 'A', verified: false, valid: false, delete: false,
              blank: false}],
            phones: []
          }
        }
      }
      const action = {field: 'emails', value: 'A', index: 0}
      expect(setNewFieldValue(oldState, action).toJS()).to.deep.equal(newState)
    })
    it('should set a new phones field value and update its attributes', () => {
      const oldState = Immutable.fromJS({
        information: {
          newInformation: {
            emails: [],
            phones: [{value: '555', type: 'old', verified: false,
              valid: true, delete: false, blank: false}]
          }
        }
      })
      const newState = {
        information: {
          newInformation: {
            emails: [],
            phones: [{value: '1', type: 'new', verified: false,
              valid: true, delete: false, blank: false}]
          }
        }
      }
      const action = {field: 'phones', index: 0, value: {
        value: '1', type: 'new'}}
      expect(setNewFieldValue(oldState, action).toJS()).to.deep.equal(newState)
    })
  })
  describe('# Update', () => {
    it('should do nothing if the emails is verified', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [{
              value: 'test@test.com', verified: true, delete: false,
              update: true, valid: false, blank: false
            }],
            phones: []
          },
          newInformation: {
            emails: [],
            phones: []
          },
          showErrors: false
        }
      })
      const action = {field: 'emails', value: 'test2@test.com', index: 0}
      expect(updateOriginalValue(state, action)).to.deep.equal(state)
    })
    it('should do nothing if the phones value is verified', () => {
      const state = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [],
            phones: [{
              value: '123456789', type: 'personal', verified: true,
              delete: false, update: true, valid: false, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phones: []
          },
          showErrors: false
        }
      })
      const action = {field: 'phones', index: 0, value: {
        value: '+123456789',
        type: 'test'
      }}
      expect(updateOriginalValue(state, action).toJS())
        .to.deep.equal(state.toJS())
    })
    it('should update correctly a non verified phones value', () => {
      const oldState = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [],
            phones: [{
              value: '123456789', type: 'personal', verified: false,
              delete: false, update: true, valid: false, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phones: []
          },
          showErrors: false
        }
      })
      const action = {field: 'phones', index: 0, value: {
        value: '+123456789',
        type: 'test'
      }}
      const newState = {
        information: {
          originalInformation: {
            emails: [],
            phones: [{
              value: '+123456789', type: 'test', verified: false, delete: false,
              update: true, valid: true, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phones: []
          },
          showErrors: false
        }
      }
      expect(updateOriginalValue(oldState, action).toJS())
        .to.deep.equal(newState)
    })
    it('should update correctly a non verified emails value', () => {
      const oldState = Immutable.fromJS({
        information: {
          originalInformation: {
            emails: [{
              value: 'test1@test.com', verified: false, delete: false,
              update: true, valid: true, blank: false
            }],
            phones: []
          },
          newInformation: {
            emails: [],
            phones: []
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
            phones: []
          },
          newInformation: {
            emails: [],
            phones: []
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
            emails: [],
            phones: [{
              verified: true, delete: false, update: true, valid: false,
              blank: false
            }, {
              verified: true, delete: false, update: true, valid: false,
              blank: false
            }]
          },
          newInformation: {
            emails: [],
            phones: []
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
            emails: [
              {verified: false, delete: true, update: true, valid: false},
              {verified: false, delete: false, update: true, valid: true}],
            phones: [
              {verified: false, delete: false, update: true, valid: true},
              {verified: false, delete: false, update: true, valid: true}]
          },
          newInformation: {
            emails: [],
            phones: []
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
            emails: [
              {verified: true, delete: false, update: true, valid: false,
                blank: false
              }, {verified: false, delete: true, update: true, valid: false,
                blank: false
              }, {verified: false, delete: false, update: true, valid: true,
                blank: false
              }],
            phones: [{
              verified: false, delete: true, update: true, valid: false,
              blank: false
            }, {verified: false, delete: false, update: true, valid: true,
              blank: false
            }]
          },
          newInformation: {
            emails: [],
            phones: []
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
            emails: [
              {verified: false, delete: false, update: true, valid: false,
                blank: false
              }, {verified: false, delete: true, update: true, valid: false,
                blank: false
              }, {verified: false, delete: false, update: true, valid: true,
                blank: false
              }],
            phones: [{
              verified: false, delete: true, update: true, valid: false,
              blank: false
            }, {verified: false, delete: false, update: true, valid: true,
              blank: false
            }]
          },
          newInformation: {
            emails: [{blank: false, valid: false, delete: false}],
            phones: []
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
            emails: [
              {verified: false, delete: false, update: true, valid: true},
              {verified: false, delete: true, update: true, valid: false},
              {verified: false, delete: false, update: true, valid: true}],
            phones: [
              {verified: false, delete: true, update: true, valid: false},
              {verified: false, delete: false, update: true, valid: true}]
          },
          newInformation: {
            emails: [{
              value: 'test3@test.com', blank: false, valid: true, delete: false
            }],
            phones: []
          },
          showErrors: false
        }
      })
      expect(validateChanges(state).toJS().showErrors).to.be.false
    })
  })
  describe('# submitChanges', () => {
    describe('# Email', () => {
      it('should set a new valid emails value', () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [],
            phones: []
          },
          newInformation: {
            emails: [{
              value: 'test3@test.com', blank: false, valid: true, delete: false
            }],
            phones: []
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.true
        expect(deleteAttribute.called).to.be.false
      })
      it('should not set a new non valid emails value', () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [],
            phones: []
          },
          newInformation: {
            emails: [{
              value: 'test3@test.com', blank: false, valid: false, delete: false
            }],
            phones: []
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.false
        expect(deleteAttribute.called).to.be.false
      })
      it('should update a non verified valid emails value', () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [{
              value: 'test@test.com', verified: false, delete: false,
              update: true, valid: true, blank: false, id: 1
            }],
            phones: []
          },
          newInformation: {
            emails: [],
            phones: []
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.true
        expect(deleteAttribute.called).to.be.false
      })
      it('should not update a non verified email with a non valid value',
      () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [{
              value: 'test@testcom', verified: false, delete: false,
              update: true, valid: false, blank: false
            }],
            phones: []
          },
          newInformation: {
            emails: [],
            phones: []
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.false
        expect(deleteAttribute.called).to.be.false
      })
      it('should not update a verified email', () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [{
              value: 'test@testcom', verified: true, delete: false,
              update: true, valid: true, blank: false
            }],
            phones: []
          },
          newInformation: {
            emails: [],
            phones: []
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.false
        expect(deleteAttribute.called).to.be.false
      })
      it('should delete a deleted emails value', () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [{
              value: 'test1@test.com', verified: false, delete: true,
              update: false, valid: true, id: 1
            }],
            phones: []
          },
          newInformation: {
            emails: [],
            phones: []
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.false
        expect(deleteAttribute.called).to.be.true
      })
    })
    describe('# Phone', () => {
      it('should set a new valid phones value', () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [],
            phones: []
          },
          newInformation: {
            emails: [],
            phones: [{
              value: '0123456', type: 'test', blank: false, valid: true,
              delete: false
            }]
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.true
        expect(deleteAttribute.called).to.be.false
      })
      it('should not set a new non valid phones value', () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [],
            phones: []
          },
          newInformation: {
            emails: [],
            phones: [{
              value: '012x3456', type: 'test', blank: false, valid: false,
              delete: false
            }]
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.false
        expect(deleteAttribute.called).to.be.false
      })
      it('should update a non verified phones value with a valid value', () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [],
            phones: [{
              value: '123456', type: 'personal', verified: false, delete: false,
              update: true, valid: true, blank: false, id: 1
            }]
          },
          newInformation: {
            emails: [],
            phones: []
          }
        }
        submitChanges({}, services, state, webId)
        expect(deleteAttribute.called).to.be.false
        expect(storeAttribute.called).to.be.true
      })
      it('should not update a non verified phones value with a non valid value',
      () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [],
            phones: [{
              value: '123456', type: 'personal', verified: true, delete: false,
              update: true, valid: false, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phones: []
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.false
        expect(deleteAttribute.called).to.be.false
      })
      it('should not update a verified valid phones value', () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [],
            phones: [{
              value: '123456', type: 'personal', verified: true, delete: false,
              update: true, valid: true, blank: false
            }]
          },
          newInformation: {
            emails: [],
            phones: []
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.false
        expect(deleteAttribute.called).to.be.false
      })
      it('should delete a deleted phones value', () => {
        const storeAttribute = stub()
        const deleteAttribute = stub()
        const wallet = {storeAttribute, deleteAttribute}
        const services = {auth: {currentUser: {wallet}}}
        const state = {
          originalInformation: {
            emails: [],
            phones: [{
              value: '123456789', verified: false, delete: true,
              update: false, valid: true, id: 1
            }]
          },
          newInformation: {
            emails: [],
            phones: []
          }
        }
        submitChanges({}, services, state, webId)
        expect(storeAttribute.called).to.be.false
        expect(deleteAttribute.called).to.be.true
      })
    })
  })
})
