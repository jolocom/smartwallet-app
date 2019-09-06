import React from 'react'
import { shallow } from 'enzyme'
import Placeholder from '../../../src/ui/recovery/seedPhrase/components/placeholder'

describe('placeholder component', () => {
  const makeProps = (otherProps: {}) => ({
    i: 0,
    sorting: {},
    onPress: jest.fn(),
    ...otherProps,
  })

  it('matches the snapshot without sorting', () => {
    const props = makeProps({})
    const rendered = shallow(<Placeholder {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with sorting without being used', () => {
    const props = makeProps({ sorting: { 1: 'Seed', 5: 'Phrase' } })
    const rendered = shallow(<Placeholder {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with sorting with being used', () => {
    const props = makeProps({ sorting: { 0: 'Seed', 5: 'Phrase' } })
    const rendered = shallow(<Placeholder {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
