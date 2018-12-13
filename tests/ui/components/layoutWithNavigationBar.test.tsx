import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'

import { LayoutWithNavigationBar } from 'src/ui/generic'
import { LoadingSpinner } from 'src/ui/generic'


describe('LayoutWithNavigationBar component', () => {
  const COMMON_PROPS = {
    onScannerSuccess: (jwt: string) => null,
    openScanner: () => {},
    loading: false,
  }

  it('should display only loading spinner based on props', () => {
    const props = Object.assign({}, COMMON_PROPS, {
      loading: true,
      openScanner: () => {}
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
      <LayoutWithNavigationBar onScannerSuccess={() => {}} openScanner={()=> {}}>
        <Text>Sample test children</Text>
      </LayoutWithNavigationBar>
    ))

    expect(layoutComponent.find('Text').children().text()).toBe('Sample test children')
    expect(layoutComponent).toMatchSnapshot()
  })
})
