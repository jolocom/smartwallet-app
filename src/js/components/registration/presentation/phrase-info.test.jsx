import React from 'react'
import { shallow } from 'enzyme'
import PhraseInfo from './phrase-info'

describe('(Component) PhraseInfo', function() {
  it('should render properly the first time', function() {
    shallow((<PhraseInfo
      onChange={() => {}}
      onSubmit={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
