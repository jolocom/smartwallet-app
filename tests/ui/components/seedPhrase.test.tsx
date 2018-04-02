import * as React from 'react'
import { SeedPhrase } from 'src/ui/registration/components/seedPhrase'

describe('seedPhrase component', ()=> {
  it('matches the snapshot with checkbox unchecked', () => {
    const props = {
      seedPhrase: 'mock seedPhrase',
      checked: false,
      onCheck: () => null
    }

    const rendered = shallow(<SeedPhrase {...props}/>)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with checkbox checked', () => {
    const props = {
      seedPhrase: 'mock seedPhrase',
      checked: true,
      onCheck: () => null
    }
    const rendered = shallow(<SeedPhrase {...props}/>)
    expect(rendered).toMatchSnapshot()
  })
})
