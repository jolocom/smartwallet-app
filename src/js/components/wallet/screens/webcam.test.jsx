import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import WalletWebCamScreen from './webcam'
import Presentation from '../presentation/webcam'

describe.only('(Component) WalletWebCamScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow((<WalletWebCamScreen.WrappedComponent {
      ...WalletWebCamScreen.mapStateToProps(Immutable.fromJS({
        wallet: {
          webCam: {
            numberOfPhotos: 1,
            photos: [],
            onSave: () => {},
            onCancel: () => {}
          }
        }
      }))
    }
      addPhoto={() => {}}
      cancel={() => {}}
      deletePhoto={() => {}}
      save={() => {}} />),
    { context: { muiTheme: { } } })

    expect(wrapper.find(Presentation).props().photos).to.be.empty
  })
  it('should call addPhoto with proper params', () => {
    const addPhoto = stub()
    const wrapper = shallow((<WalletWebCamScreen.WrappedComponent {
      ...WalletWebCamScreen.mapStateToProps(Immutable.fromJS({
        wallet: {
          webCam: {
            numberOfPhotos: 1,
            photos: [],
            onSave: () => {},
            onCancel: () => {}
          }
        }
      }))
    }
      addPhoto={addPhoto}
      cancel={() => {}}
      deletePhoto={() => {}}
      save={() => {}} />),
    { context: { muiTheme: { } } })

    wrapper.find(Presentation).props().addPhoto('test')
    expect(addPhoto.called).to.be.true
    expect(addPhoto.calls).to.deep.equal([{args: ['test']}])
  })
  it('should call cancel with proper params', () => {
    const cancel = stub()
    const wrapper = shallow((<WalletWebCamScreen.WrappedComponent {
      ...WalletWebCamScreen.mapStateToProps(Immutable.fromJS({
        wallet: {
          webCam: {
            numberOfPhotos: 1,
            photos: [],
            onSave: () => {},
            onCancel: () => {}
          }
        }
      }))
    }
      addPhoto={() => {}}
      cancel={cancel}
      deletePhoto={() => {}}
      save={() => {}} />),
    { context: { muiTheme: { } } })

    wrapper.find(Presentation).props().cancel('test')
    expect(cancel.called).to.be.true
    expect(cancel.calls).to.deep.equal([{args: ['test']}])
  })
  it('should call save with proper params', () => {
    const save = stub()
    const wrapper = shallow((<WalletWebCamScreen.WrappedComponent {
      ...WalletWebCamScreen.mapStateToProps(Immutable.fromJS({
        wallet: {
          webCam: {
            numberOfPhotos: 1,
            photos: [],
            onSave: () => {},
            onCancel: () => {}
          }
        }
      }))
    }
      addPhoto={() => {}}
      cancel={() => {}}
      deletePhoto={() => {}}
      save={save} />),
    { context: { muiTheme: { } } })

    wrapper.find(Presentation).props().save('test')
    expect(save.called).to.be.true
    expect(save.calls).to.deep.equal([{args: ['test']}])
  })
  it('should call deletePhoto with proper params', () => {
    const deletePhoto = stub()
    const wrapper = shallow((<WalletWebCamScreen.WrappedComponent {
      ...WalletWebCamScreen.mapStateToProps(Immutable.fromJS({
        wallet: {
          webCam: {
            numberOfPhotos: 1,
            photos: [],
            onSave: () => {},
            onCancel: () => {}
          }
        }
      }))
    }
      addPhoto={() => {}}
      cancel={() => {}}
      save={() => {}}
      deletePhoto={deletePhoto} />),
    { context: { muiTheme: { } } })

    wrapper.find(Presentation).props().deletePhoto('test')
    expect(deletePhoto.called).to.be.true
    expect(deletePhoto.calls).to.deep.equal([{args: ['test']}])
  })
})
