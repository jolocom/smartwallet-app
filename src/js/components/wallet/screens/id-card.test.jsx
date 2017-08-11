import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import WalletIdCardScreen from './id-card'
import Presentation from '../presentation/id-card'

describe('(Component) WalletIdCardScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={() => {}}
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
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={() => {}}
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
  it('should parse physicalAddress object to array', () => {
    const wrapper = shallow(
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={() => {}}
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
    const field = {value: '', valid: false, group: 'address'}
    expect(wrapper.find(Presentation).prop('physicalAddress')).to.deep.equal([
      {...field, key: 'streetWithNumber', label: 'Street'},
      {...field, key: 'zip', label: 'Zip'},
      {...field, key: 'city', label: 'City'},
      {...field, key: 'state', label: 'State'},
      {...field, options: [], key: 'country', label: 'Country'}
    ])
  })
  it('should parse idCard object to array', () => {
    const wrapper = shallow(
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={() => {}}
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
    const field = {value: '', valid: false}
    expect(wrapper.find(Presentation).prop('idCard')).to.deep.equal([
      {label: 'ID Card Image', key: 'frontSideImg', group: 'img', value: ''},
      {label: 'ID Card Image', key: 'backSideImg', group: 'img', value: ''},
      {...field, label: 'ID Card Number', key: 'number', group: 'numbers'},
      {...field, label: 'Expiration Date', key: 'expirationDate', group: 'numbers'}, // eslint-disable-line max-len
      {...field, label: 'First Name', key: 'firstName', group: 'person'},
      {...field, label: 'Last Name', key: 'lastName', group: 'person'},
      {...field, options: [], label: 'Gender', key: 'gender', group: 'person'},
      {...field, label: 'Date of Birth', key: 'birthDate', group: 'cake'},
      {...field, label: 'Place of Birth', key: 'birthPlace', group: 'cake'},
      {...field, options: [], label: 'Country of Birth', key: 'birthCountry', group: 'cake'} // eslint-disable-line max-len
    ])
  })
  it('should call cancel with proper params', () => {
    const cancel = stub()
    const wrapper = shallow(
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={() => {}}
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
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={() => {}}
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
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={() => {}}
        initiateCountrySelectScreen={initiate}
        changePhysicalAddressField={() => {}}
        setFocusedField={() => {}}
        setShowAddress={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().selectCountry('idCard')
    expect(initiate.called).to.be.true
    expect(initiate.calls).to.deep.equal([{args: ['idCard']}])
  })
  it('should call changeIdCardField with proper params when the field is in passpoer', () => { // eslint-disable-line max-len
    const changeIdCardField = stub()
    const wrapper = shallow(
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={changeIdCardField}
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
    expect(changeIdCardField.called).to.be.true
    expect(changeIdCardField.calls).to.deep.equal([{args: ['firstName', '']}])
  })
  it('should call changePhysicalAddressField with proper params when the field is in physicalAddress', () => { // eslint-disable-line max-len
    const changePhysicalAddressField = stub()
    const setShowAddress = stub()
    const wrapper = shallow(
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={() => {}}
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
    expect(setShowAddress.called).to.be.false
    // expect(setShowAddress.calls).to.deep.equal([{args: [true]}])
    expect(changePhysicalAddressField.calls)
      .to.deep.equal([{args: ['zip', 'test']}])
  })
  it('should call changeIdCardField for idCard fields', () => {
    const changeIdCardField = stub()
    const setShowAddress = stub()
    const wrapper = shallow(
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={changeIdCardField}
        initiate={() => {}}
        changePhysicalAddressField={() => {}}
        setFocusedField={() => {}}
        setShowAddress={setShowAddress}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.instance().change('firstName', 'test')
    expect(changeIdCardField.called).to.be.true
    expect(changeIdCardField.calls).to
      .deep.equal([{args: ['firstName', 'test']}])
    expect(setShowAddress.called).to.be.false
  })
  it('should call changePhysicalAddressField for physicalAddress field', () => {
    const changePhysicalAddressField = stub()
    const setShowAddress = stub()
    const wrapper = shallow(
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changePhysicalAddressField={changePhysicalAddressField}
        initiate={() => {}}
        changeIdCardField={() => {}}
        setShowAddress={setShowAddress}
        setFocusedField={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}} />),
      {context: {muiTheme: {}}}
    )
    wrapper.instance().change('city', 'test')
    expect(changePhysicalAddressField.called).to.be.true
    expect(changePhysicalAddressField.calls).to
    .deep.equal([{args: ['city', 'test']}])
    expect(setShowAddress.called).to.be.false
  })
  it('should call setShowAddress for change streetWithNumber', () => {
    const changePhysicalAddressField = stub()
    const setShowAddress = stub()
    const wrapper = shallow(
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changePhysicalAddressField={changePhysicalAddressField}
        initiate={() => {}}
        changeIdCardField={() => {}}
        setShowAddress={setShowAddress}
        setFocusedField={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}} />),
      {context: {muiTheme: {}}}
    )
    wrapper.instance().change('streetWithNumber', 'test')
    expect(changePhysicalAddressField.called).to.be.true
    expect(changePhysicalAddressField.calls).to
    .deep.equal([{args: ['streetWithNumber', 'test']}])
    expect(setShowAddress.called).to.be.true
  })
})
