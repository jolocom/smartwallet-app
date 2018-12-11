import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'

import { LayoutWithNavigationBar } from 'src/ui/generic'
import { QRcodeScanner } from 'src/ui/generic/qrcodeScanner'
import { LoadingSpinner } from 'src/ui/generic'


describe('LayoutWithNavigationBar component', () => {
  const COMMON_PROPS = {
    onScannerSuccess: (jwt: string) => null,
    loading: false,
  }

  it('should display only qr code scanner based on state', () => {
    const layoutComponent = shallow((
      <LayoutWithNavigationBar {...COMMON_PROPS}>
        <Text>Sample test children</Text>
      </LayoutWithNavigationBar>
    ))
    layoutComponent.setState({ scanning: true })

    expect(layoutComponent.find(QRcodeScanner).length).toBe(1)
    expect(layoutComponent.find(Text).length).toBe(0)
    expect(layoutComponent).toMatchSnapshot()
  })

  it('should display only loading spinner based on state', () => {
    const layoutComponent = shallow((
      <LayoutWithNavigationBar {...COMMON_PROPS}>
        <Text>Sample test children</Text>
      </LayoutWithNavigationBar>
    ))
    layoutComponent.setState({ loading: true })

    expect(layoutComponent.find(LoadingSpinner).length).toBe(1)
    expect(layoutComponent.find(Text).length).toBe(0)
    expect(layoutComponent).toMatchSnapshot()
  })

  it('should display only loading spinner based on props', () => {
    const props = Object.assign({}, COMMON_PROPS, {
      loading: true
    })
    const layoutComponent = shallow((
      <LayoutWithNavigationBar {...props}>
        <Text>Sample test children</Text>
      </LayoutWithNavigationBar>
    ))

    expect(layoutComponent.find(LoadingSpinner).length).toBe(1)
    expect(layoutComponent.find(Text).length).toBe(0)
    expect(layoutComponent).toMatchSnapshot()
  })

  it('should render children with qr code button in a navigation if no loading and scanning state', () => {
    const layoutComponent = shallow((
      <LayoutWithNavigationBar>
        <Text>Sample test children</Text>
      </LayoutWithNavigationBar>
    ))

    expect(layoutComponent.find('Text').children().text()).toBe('Sample test children')
    expect(layoutComponent).toMatchSnapshot()
  })
})
