import * as React from 'react'
import { shallow } from 'enzyme'
import { EntropyContainer } from 'src/ui/registration/containers/entropy'
import { EntropyGenerator} from 'src/lib/entropyGenerator'

describe('Entropy container', () => {
    const props = {}

  it('matches the snapshot', () => {
    const rendered = shallow(
        <EntropyContainer {...props}/>
    )
    expect(rendered).toMatchSnapshot()
  })

  it('correctly creates an entropy generator upon component mount', () => {
    const entropySpy = jest.spyOn(EntropyContainer.prototype, 'setUpEntropyGenerator')
    const rendered = shallow(
        <EntropyContainer {...props}/>
    )
    expect(entropySpy).toHaveBeenCalledTimes(1)
  })

  it('correctly handles added points with the entropy generator', () => {
    const rendered = shallow(
        <EntropyContainer {...props}/>
    )
    expect(rendered.state().entropyProgress).toBe(0)

    const instance = rendered.instance()
    const mockPoint = { x: 1, y: 2 }
    const mockGetProgress = jest.fn()
    mockGetProgress.mockReturnValue(1)
    instance.entropyGenerator.getProgress = mockGetProgress
    instance.updateEntropyProgress = jest.fn()
    instance.entropyGenerator.addFromDelta = jest.fn()
    instance.addPoint(mockPoint)

    expect(instance.entropyGenerator.addFromDelta).toHaveBeenCalledTimes(2)
    expect(instance.entropyGenerator.addFromDelta).toBeCalledWith(mockPoint)
    expect(instance.entropyGenerator.getProgress).toHaveBeenCalledTimes(1)
    expect(rendered.state().entropyProgress).toBe(1)
    expect(instance.updateEntropyProgress).toHaveBeenCalledTimes(1)
  })

  it('correctly triggers a random string generation when there is sufficient entropy', () => {
    const rendered = shallow(
        <EntropyContainer {...props}/>
    )
    expect(rendered.state().entropyProgress).toBe(0)
    expect(rendered.state().sufficientEntropy).toBe(false)

    const mockGenerateRandomString = jest.fn()
    mockGenerateRandomString.mockReturnValue('this is a random string')
    rendered.instance().entropyGenerator.generateRandomString = mockGenerateRandomString
    rendered.setState({ entropyProgress: 1 })
    rendered.instance().updateEntropyProgress()
    
    expect(rendered.state().encodedEntropy).toBe('this is a random string')
    expect(rendered.state().sufficientEntropy).toBe(true)
  })

  it('does not trigger a random string generation when there is not sufficient entropy', () => {
    const rendered = shallow(
        <EntropyContainer {...props}/>
    )
    expect(rendered.state().entropyProgress).toBe(0)
    expect(rendered.state().sufficientEntropy).toBe(false)

    const mockGenerateRandomString = jest.fn()
    mockGenerateRandomString.mockReturnValue('this is a random string')
    rendered.instance().entropyGenerator.generateRandomString = mockGenerateRandomString
    rendered.setState({ entropyProgress: .99})
    rendered.instance().updateEntropyProgress()
    
    expect(rendered.state().encodedEntropy).toBe('')
    expect(rendered.state().sufficientEntropy).toBe(false)
  }) 
})
