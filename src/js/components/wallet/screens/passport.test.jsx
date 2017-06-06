import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import WalletPaasportScreen from './passport'
import Presentation from '../presentation/passport'

describe.only('(Component) WalletPaasportScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<WalletPaasportScreen.WrappedComponent {
        ...WalletPaasportScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            passport: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              passport: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        save={() => {}}
        retrievePassportInformation={() => {}}
        changePassportField={() => {}}
        initiate={() => {}}
        changePhysicalAddressField={() => {}}
        setFocusedField={() => {}}
        setShowAddress={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find(Presentation).prop('loaded')).to.be.false
  })
  it('should call save with proper params', () => {
    const save = stub()
    const wrapper = shallow(
      (<WalletPaasportScreen.WrappedComponent {
        ...WalletPaasportScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            passport: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              passport: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        save={save}
        retrievePassportInformation={() => {}}
        changePassportField={() => {}}
        initiate={() => {}}
        changePhysicalAddressField={() => {}}
        setFocusedField={() => {}}
        setShowAddress={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().save()
    expect(save.called).to.be.true
    expect(save.calls).to.deep.equal([{args: []}])
  })
  it('should call cancel with proper params', () => {
    const cancel = stub()
    const wrapper = shallow(
      (<WalletPaasportScreen.WrappedComponent {
        ...WalletPaasportScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            passport: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              passport: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        save={() => {}}
        retrievePassportInformation={() => {}}
        changePassportField={() => {}}
        initiate={() => {}}
        changePhysicalAddressField={() => {}}
        setFocusedField={() => {}}
        setShowAddress={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={cancel}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().cancel()
    expect(cancel.called).to.be.true
    expect(cancel.calls).to.deep.equal([{args: []}])
  })
  it('should call setFocusedField with proper params', () => {
    const setFocusedField = stub()
    const wrapper = shallow(
      (<WalletPaasportScreen.WrappedComponent {
        ...WalletPaasportScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            passport: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              passport: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        save={() => {}}
        retrievePassportInformation={() => {}}
        changePassportField={() => {}}
        initiate={() => {}}
        changePhysicalAddressField={() => {}}
        setFocusedField={setFocusedField}
        setShowAddress={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().setFocused('country', 'place')
    expect(setFocusedField.called).to.be.true
    expect(setFocusedField.calls).to.deep.equal([{args: ['country', 'place']}])
  })
  it('should call initiate with proper params', () => {
    const initiate = stub()
    const wrapper = shallow(
      (<WalletPaasportScreen.WrappedComponent {
        ...WalletPaasportScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            passport: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              passport: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        save={() => {}}
        retrievePassportInformation={() => {}}
        changePassportField={() => {}}
        initiate={initiate}
        changePhysicalAddressField={() => {}}
        setFocusedField={() => {}}
        setShowAddress={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().selectCountry('passport')
    expect(initiate.called).to.be.true
    expect(initiate.calls).to.deep.equal([{args: ['passport']}])
  })
  it('should call changePassportField with proper params when the field is in passpoer', () => { // eslint-disable-line max-len
    const changePassportField = stub()
    const wrapper = shallow(
      (<WalletPaasportScreen.WrappedComponent {
        ...WalletPaasportScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            passport: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              passport: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        save={() => {}}
        retrievePassportInformation={() => {}}
        changePassportField={changePassportField}
        initiate={() => {}}
        changePhysicalAddressField={() => {}}
        setFocusedField={() => {}}
        setShowAddress={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().change('firstName', '')
    expect(changePassportField.called).to.be.true
    expect(changePassportField.calls).to.deep.equal([{args: ['firstName', '']}])
  })
  it('should call changePhysicalAddressField with proper params when the field is in physicalAddress', () => { // eslint-disable-line max-len
    const changePhysicalAddressField = stub()
    const setShowAddress = stub()
    const wrapper = shallow(
      (<WalletPaasportScreen.WrappedComponent {
        ...WalletPaasportScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            passport: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              passport: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        save={() => {}}
        retrievePassportInformation={() => {}}
        changePassportField={() => {}}
        initiate={() => {}}
        changePhysicalAddressField={changePhysicalAddressField}
        setFocusedField={() => {}}
        setShowAddress={setShowAddress}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().change('zip', 'test')
    expect(changePhysicalAddressField.called).to.be.true
    expect(setShowAddress.called).to.be.true
    expect(setShowAddress.calls).to.deep.equal([{args: [true]}])
    expect(changePhysicalAddressField.calls)
      .to.deep.equal([{args: ['zip', 'test']}])
  })
})
