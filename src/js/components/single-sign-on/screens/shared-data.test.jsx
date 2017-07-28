import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import SingleSignOnSharedDatatScreen from './shared-data'
import Presentation from '../presentation/shared-data'
import ErrorScreen from '../../common/error'
import {stub} from '../../../../../test/utils'

describe.only('(Component) SingleSignOnSharedDatatScreen', () => {
  it('should render properly when given the correct information', () => {
    const wrapper = shallow((<SingleSignOnSharedDatatScreen.WrappedComponent
      {...SingleSignOnSharedDatatScreen.mapStateToProps(Immutable.fromJS({
        singleSignOn: {
          accessRight: {
            loaded: true, failed: false, serviceNumber: 0,
            services: [{
              label: 'label1', url: 'test.com', id: '1', iconUrl: 'path.svg',
              sharedData: [{
                attrType: 'phone', value: '96574', type: 'work', verified: true,
                status: ''
              }]
            }]
          }
        }
      }))}
      deleteService={() => {}}
      goToAccessRightScreen={() => {}}
      openConfirmDialog={() => {}}
      closeConfirmDialog={() => {}} />)
    )
    expect(wrapper.find(Presentation).props().serviceName).to.equal('label1')
  })
  it('should render error screen when given information', () => {
    const wrapper = shallow((<SingleSignOnSharedDatatScreen.WrappedComponent
      {...SingleSignOnSharedDatatScreen.mapStateToProps(Immutable.fromJS({
        singleSignOn: {
          accessRight: {
            loaded: true, failed: false, serviceNumber: 0, services: []
          }
        }
      }))}
      deleteService={() => {}}
      goToAccessRightScreen={() => {}}
      openConfirmDialog={() => {}}
      closeConfirmDialog={() => {}} />)
    )
    expect(wrapper.find(ErrorScreen).props().buttonLabel)
      .to.equal('try again...')
  })
  it('should call go to access right screen with proper params', () => {
    const goToAccessRightScreen = stub()
    const wrapper = shallow((<SingleSignOnSharedDatatScreen.WrappedComponent
      {...SingleSignOnSharedDatatScreen.mapStateToProps(Immutable.fromJS({
        singleSignOn: {
          accessRight: {
            loaded: true, failed: false, serviceNumber: 0,
            services: [{
              label: 'label1', url: 'test.com', id: '1', iconUrl: 'path.svg',
              sharedData: [{
                attrType: 'phone', value: '96574', type: 'work', verified: true,
                status: ''
              }]
            }]
          }
        }
      }))}
      deleteService={() => {}}
      goToAccessRightScreen={goToAccessRightScreen}
      openConfirmDialog={() => {}}
      closeConfirmDialog={() => {}} />)
    )
    wrapper.find(Presentation).props().goToAccessRightScreen()
    expect(goToAccessRightScreen.called).to.be.true
    expect(goToAccessRightScreen.calls).to.deep.equal([{args: []}])
  })
  it('should call openConfirmDialog and deleteService with proper params',
  () => {
    const deleteService = stub()
    const openConfirmDialog = stub()
    const wrapper = shallow((<SingleSignOnSharedDatatScreen.WrappedComponent
      {...SingleSignOnSharedDatatScreen.mapStateToProps(Immutable.fromJS({
        singleSignOn: {
          accessRight: {
            loaded: true, failed: false, serviceNumber: 0,
            services: [{
              url: 'test.com', id: '1', label: 'label1', iconUrl: 'path.svg',
              sharedData: [{
                attrType: 'phone', value: '96574', type: 'work', verified: true,
                status: ''
              }]
            }]
          }
        }
      }))}
      deleteService={deleteService}
      goToAccessRightScreen={() => {}}
      openConfirmDialog={openConfirmDialog}
      closeConfirmDialog={() => {}} />)
    )
    wrapper.find(Presentation).props().showDeleteServiceWindow({
      title: 'test title',
      message: 'test message',
      style: {},
      rightButtonLabel: 'test rightButtonLabel',
      leftButtonLabel: 'test leftButtonLabel',
      index: 0
    })
    expect(openConfirmDialog.called).to.be.true
    openConfirmDialog.calls[0].args[3]()
    expect(deleteService.called).to.be.true
    expect(openConfirmDialog.calls[0].args[0]).to.equal('test title')
    expect(openConfirmDialog.calls[0].args[1]).to.equal('test message')
    expect(openConfirmDialog.calls[0].args[2]).to.equal('test rightButtonLabel')
    expect(openConfirmDialog.calls[0].args[4]).to.equal('test leftButtonLabel')
    expect(deleteService.calls).to.deep.equal([{args: [0]}])
  })
})
