import * as React from 'react'
import { mount, shallow } from 'enzyme'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'

describe('MaskedImage component', ()=> {
  const props = {
    addPoint: (x: number, y: number) => null 
  }

  it('correctly calls the function to configure PanResponder on component mount', () => {
      const configureSpy = jest.spyOn(MaskedImageComponent.prototype, 'getConfiguredPanResponder');
      const rendered = shallow(<MaskedImageComponent{...props} />);
      expect(configureSpy).toHaveBeenCalledTimes(1);
  })

  it('matches the snapshot with empty current path string', () => {
    const rendered = shallow(<MaskedImageComponent {...props}/>)
    expect(rendered).toMatchSnapshot()
    expect(rendered.state().currentPath).toEqual([])
    expect(rendered.state().limit).toEqual(15)
  })

  it('correctly handles a gesture start', () => {
    const mockNativeEvent = {
      nativeEvent: {
        locationX: 191.5,
        locationY: 381
      }
    }
    const rendered = shallow(<MaskedImageComponent {...props}/>)

    rendered.instance().handleNewPoint = jest.fn()
    rendered.update()
    rendered.instance().handleDrawStart(mockNativeEvent)
    expect(rendered.instance().handleNewPoint).toBeCalledWith({
      type: 'M',
      x: mockNativeEvent.nativeEvent.locationX,
      y: mockNativeEvent.nativeEvent.locationY
    }) 
  })

  it('correctly handles gesture continuation', () => {
    const rendered = shallow(<MaskedImageComponent {...props}/>)
    const mockNativeEvent = {
      nativeEvent: {
        locationX: 188,
        locationY: 381
      }
    }
    rendered.instance().handleNewPoint = jest.fn()
    rendered.update()
    rendered.instance().handleDraw(mockNativeEvent)
    expect(rendered.instance().handleNewPoint).toBeCalledWith({
      type: 'L',
      x: mockNativeEvent.nativeEvent.locationX,
      y: mockNativeEvent.nativeEvent.locationY
    }) 
  })

  it('correctly handles adding new points to the current path if the path length is shorter than the limit', () => {
    const point = {type: "L", x: 188, y: 381}
    const rendered = shallow(<MaskedImageComponent {...props}/>)

    expect(rendered.state().currentPath).toEqual([])
    rendered.setState({currentPath: ["M191.5 381"]})
    rendered.instance().handleNewPoint(point)
    expect(rendered.state().currentPath).toEqual(["M191.5 381", "L188 381"])
  })

  it('correctly handles adding new points to the current path if the path length is longer than the limit', () => {
    const point = {type: "L", x: 187.5, y: 188.5}
    const rendered = shallow(<MaskedImageComponent {...props}/>)

    expect(rendered.state().currentPath).toEqual([])
    rendered.setState({currentPath: ["M171.5 171", "L173 172.5", "L175 174.5", "L176 176", "L177.5 177.5", "L179 179", "L180 180.5", "L181 182", "L182 183", "L183 184", "L184 185", "L185 186", "L186 186.5", "L186.5 187.5", "L187 188"]})
    rendered.instance().handleNewPoint(point)
    expect(rendered.state().currentPath).toEqual(["M173 172.5", "L175 174.5", "L176 176", "L177.5 177.5", "L179 179", "L180 180.5", "L181 182", "L182 183", "L183 184", "L184 185", "L185 186", "L186 186.5", "L186.5 187.5", "L187 188", "L187.5 188.5"])
  })
})