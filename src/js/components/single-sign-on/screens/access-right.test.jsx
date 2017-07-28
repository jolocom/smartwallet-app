import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import SingleSignOnAccessRightScreen from './access-right'
import Presentation from '../presentation/access-right'
import {stub} from '../../../../../test/utils'

describe.only('(Component) SingleSignOnAccessRightScreen', () => {
  it('should call retrieveConnectedServices to start', () => {
    const retrieveConnectedServices = stub()
    const wrapper = shallow((<SingleSignOnAccessRightScreen.WrappedComponent
      {...SingleSignOnAccessRightScreen.mapStateToProps(Immutable.fromJS({
        singleSignOn: {
          accessRight: {
            loaded: true,
            failed: false,
            serviceNumber: 0,
            services: []
          }
        }
      }))}
      deleteService={() => {}}
      showSharedData={() => {}}
      retrieveConnectedServices={retrieveConnectedServices}
      openConfirmDialog={() => {}}
      closeConfirmDialog={() => {}} />)
    )
    wrapper.instance()
    expect(retrieveConnectedServices.called).to.be.true
  })
  it('should call showSharedData to with proper params', () => {
    const showSharedData = stub()
    const wrapper = shallow((<SingleSignOnAccessRightScreen.WrappedComponent
      {...SingleSignOnAccessRightScreen.mapStateToProps(Immutable.fromJS({
        singleSignOn: {
          accessRight: {
            loaded: true,
            failed: false,
            serviceNumber: 0,
            services: []
          }
        }
      }))}
      deleteService={() => {}}
      showSharedData={showSharedData}
      retrieveConnectedServices={() => {}}
      openConfirmDialog={() => {}}
      closeConfirmDialog={() => {}} />)
    )
    wrapper.find(Presentation).props().showSharedData(0)
    expect(showSharedData.called).to.be.true
    expect(showSharedData.calls).to.deep.equal([{args: [0]}])
  })
  it('should call openConfirmDialog and deleteService with proper params',
  () => {
    const openConfirmDialog = stub()
    const deleteService = stub()
    const wrapper = shallow((<SingleSignOnAccessRightScreen.WrappedComponent
      {...SingleSignOnAccessRightScreen.mapStateToProps(Immutable.fromJS({
        singleSignOn: {
          accessRight: {
            loaded: true,
            failed: false,
            serviceNumber: 0,
            services: []
          }
        }
      }))}
      deleteService={deleteService}
      showSharedData={() => {}}
      retrieveConnectedServices={() => {}}
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
