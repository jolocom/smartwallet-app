import React from 'react'
import { shallow } from 'enzyme'
import { IdentityContainer } from 'src/ui/home/containers/identity'


describe('Identity container', () => {
  const COMMON_PROPS = {
    userName: '',
    phoneNumber: '',
    emailAddress: '',
    scanning: false
  }

  it('mounts correctly and matches the snapshot', () => {
    const rendered = shallow(<IdentityContainer {...COMMON_PROPS}/>)
    expect(rendered).toMatchSnapshot()
  })

  it('correctly changes scanning to true when qr code scanner is started', () => {
    const onScannerStart = jest.fn()

    const props = Object.assign({}, COMMON_PROPS {
      scanning: true
    })

    const rendered = shallow(<IdentityContainer {...props}/>)
    expect(rendered).toMatchSnapshot()
  })

  it('correctly changes scanning to false when qr code scanner is canceled', () => {
    const onScannerCancel = jest.fn()
    const props = Object.assign({}, COMMON_PROPS {
      scanning: false
    })

    const rendered = shallow(<IdentityContainer {...props}/>)
    expect(rendered).toMatchSnapshot()
  })


















  // it('correctly handles added points with the entropy generator', () => {
  //   const rendered = shallow(<EntropyContainer {...props}/>)
  //   const instance = rendered.instance()
  //
  //   expect(rendered.state()).toMatchSnapshot()
  //
  //   instance.updateEntropyProgress = jest.fn()
  //   instance.entropyGenerator.getProgress = jest.fn().mockReturnValue(1)
  //   instance.entropyGenerator.addFromDelta = jest.fn()
  //
  //   instance.addPoint(150, 220)
  //
  //   expect(instance.entropyGenerator.getProgress).toHaveBeenCalledTimes(1)
  //   expect(instance.updateEntropyProgress).toHaveBeenCalledTimes(1)
  //   expect(instance.entropyGenerator.addFromDelta).toHaveBeenCalledTimes(2)
  //   expect(instance.entropyGenerator.addFromDelta.mock.calls)
  //     .toEqual([ [150], [220] ])
  //
  //   expect(rendered.state()).toMatchSnapshot()
  // })
  //
  // it('correctly triggers a random string generation when there is sufficient entropy', () => {
  //   const rendered = shallow(<EntropyContainer {...props}/>)
  //   const instance = rendered.instance()
  //
  //   expect(rendered.state()).toMatchSnapshot()
  //
  //   const mockGenerateRandomString = jest.fn().mockReturnValue('randomString')
  //   instance.entropyGenerator.generateRandomString = mockGenerateRandomString
  //
  //   rendered.setState({ entropyProgress: 1 })
  //   instance.updateEntropyProgress()
  //
  //   expect(rendered.state()).toMatchSnapshot()
  // })
  //
  // it('does not trigger a random string generation when there is not sufficient entropy', () => {
  //   const rendered = shallow(<EntropyContainer {...props}/>)
  //   const instance = rendered.instance()
  //
  //   expect(rendered.state()).toMatchSnapshot()
  //
  //   const mockGenerateRandomString = jest.fn().mockReturnValue('randomString')
  //   instance.entropyGenerator.generateRandomString = mockGenerateRandomString
  //   rendered.setState({ entropyProgress: 0.99 })
  //   instance.updateEntropyProgress()
  //
  //   expect(rendered.state()).toMatchSnapshot()
  // })
})
