import React from 'react'
import { mount, shallow } from 'enzyme'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'

describe('MaskedImage component', () => {
  const props = {
    addPoint: (x: number, y: number) => null,
  }

  it('correctly calls the function to configure PanResponder on component mount', () => {
    const configureSpy = jest.spyOn(
      MaskedImageComponent.prototype,
      'getConfiguredPanResponder',
    )
    const rendered = shallow(<MaskedImageComponent {...props} />)
    expect(configureSpy).toHaveBeenCalledTimes(1)
  })

  it('matches the snapshot with empty current path string', () => {
    const rendered = shallow(<MaskedImageComponent {...props} />)
    expect(rendered).toMatchSnapshot()
    expect(rendered.state().currentPath).toEqual([])
    expect(rendered.state().limit).toEqual(15)
  })

  it('correctly handles a gesture start', () => {
    const mockNativeEvent = {
      nativeEvent: {
        locationX: 191.5,
        locationY: 381,
      },
    }
    const rendered = shallow(<MaskedImageComponent {...props} />)
    const instance = rendered.instance()

    instance.handleNewPoint = jest.fn()
    instance.handleDrawStart(mockNativeEvent)

    expect(instance.handleNewPoint).toBeCalledWith({
      type: 'M',
      x: mockNativeEvent.nativeEvent.locationX,
      y: mockNativeEvent.nativeEvent.locationY,
    })
  })

  it('correctly handles gesture continuation', () => {
    const mockNativeEvent = {
      nativeEvent: {
        locationX: 188,
        locationY: 381,
      },
    }

    const rendered = shallow(<MaskedImageComponent {...props} />)
    const instance = rendered.instance()

    instance.handleNewPoint = jest.fn()
    instance.handleDraw(mockNativeEvent)

    expect(instance.handleNewPoint).toBeCalledWith({
      type: 'L',
      x: mockNativeEvent.nativeEvent.locationX,
      y: mockNativeEvent.nativeEvent.locationY,
    })
  })

  it('correctly handles adding new points to the current path if the path length is shorter than the limit', () => {
    const rendered = shallow(<MaskedImageComponent {...props} />)

    rendered.setState({ currentPath: ['M191.5 381'] })
    rendered.update()
    expect(rendered).toMatchSnapshot()

    rendered.instance().handleNewPoint({ type: 'L', x: 188, y: 381 })
    rendered.update()
    expect(rendered).toMatchSnapshot()
  })

  it('correctly handles adding new points to the current path if the path length is longer than the limit', () => {
    const point = { type: 'L', x: 187.5, y: 188.5 }
    const rendered = shallow(<MaskedImageComponent {...props} />)

    const lengthLimit = rendered.state().limit
    const mockMaxLengthPath = Array(lengthLimit).fill('L173 174')

    rendered.setState({ currentPath: mockMaxLengthPath })
    rendered.update()
    expect(rendered).toMatchSnapshot()

    rendered.instance().handleNewPoint(point)
    rendered.update()
    expect(rendered).toMatchSnapshot()
  })
})
