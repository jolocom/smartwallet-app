import React from 'react'
import Immutable from 'immutable'
import {expect} from 'chai'
import {shallow} from 'enzyme'
import AccessRequestScreen from './access-request'
// import Presentation from '../presentation/access-request'
import {stub} from '../../../../../test/utils'

describe('(Component) AccessRequestScreen', () => {
  it('should call getClaims and getDid to start on componentWillMount', () => { // eslint-disable-line max-len
    const getClaims = stub()
    const getDid = stub()
    const wrapper = shallow((<AccessRequestScreen.WrappedComponent
      {...AccessRequestScreen.mapStateToProps(Immutable.fromJS({
        wallet: {
          identityNew: {
            toggleEdit: {
              field: '',
              bool: false
            },
            userData: {
              phone: '',
              name: '',
              email: ''
            },
            scanningQr: {
              scanning: false,
              scannedValue: ''
            },
            errorMsg: ''
          }
        },
        singleSignOn: {
          accessRequest: {
            entity: {
              loading: false,
              name: 'SOME COMPANY',
              image: 'img/hover_board.jpg',
              returnURL: '',
              infoComplete: false,
              claims: {},
              response: {},
              userDid: ''
            }
          }
        }
      }))
    }
      getClaims={getClaims}
      getDid={getDid}
      requestedFields={[]}
      setSelectedClaim={() => {}}
      identityNew={{}}
      accessRequest={{}}
      configMsg={() => {}}
      showDialog={() => {}}
      openConfirmDialog={() => {}}
      confirmAccess={() => {}}
      denyAccess={() => {}}
      setInfoComplete={() => {}} />
    ))
    wrapper.instance().componentDidMount()
    // eslint-disable-next-line
    expect(getClaims.called).to.be.true
    // eslint-disable-next-line
    expect(getDid.called).to.be.true
  })

  it('should display dialog on calling handleDeny', () => {
    const openConfirmDialog = stub()
    const handleDeny = stub()
    const wrapper = shallow((<AccessRequestScreen.WrappedComponent
      {...AccessRequestScreen.mapStateToProps(Immutable.fromJS({
        wallet: {
          identityNew: {
            toggleEdit: {
              field: '',
              bool: false
            },
            userData: {
              phone: '',
              name: '',
              email: ''
            },
            scanningQr: {
              scanning: false,
              scannedValue: ''
            },
            errorMsg: ''
          }
        },
        singleSignOn: {
          accessRequest: {
            entity: {
              loading: false,
              name: 'SOME COMPANY',
              image: 'img/hover_board.jpg',
              returnURL: '',
              infoComplete: false,
              claims: {},
              response: {},
              userDid: ''
            }
          }
        }
      }))}
      getClaims={() => {}}
      getDid={() => {}}
      requestedFields={[]}
      setSelectedClaim={() => {}}
      identityNew={{}}
      accessRequest={{}}
      configMsg={() => {}}
      showDialog={() => {}}
      openConfirmDialog={openConfirmDialog}
      confirmAccess={() => {}}
      denyAccess={() => {}}
      handleDeny={handleDeny}
      setInfoComplete={() => {}} />
    ))
    wrapper.instance().handleDeny()
    // eslint-disable-next-line
    expect(openConfirmDialog.called).to.be.true
  })
})
