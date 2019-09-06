import React from 'react'
import { SeedPhrase } from 'src/ui/recovery/seedPhrase/components/seedPhrase'
import { shallow } from 'enzyme'

describe('seedPhrase component', () => {
  const makeProps = () => ({
    seedPhrase: 'mock seedPhrase',
    handleButtonTap: jest.fn(),
    onCheck: jest.fn(),
  })

  it('matches the snapshot with checkbox unchecked', () => {
    const props = makeProps()
    const rendered = shallow(<SeedPhrase {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
