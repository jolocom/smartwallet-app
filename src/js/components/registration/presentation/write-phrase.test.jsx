import React from 'react'
import { shallow } from 'enzyme'
import WritePhrase from './write-phrase'

describe('(Component) WritePhrase', function() {
  it('should render properly the first time', function() {
    shallow((<WritePhrase
      value=""
      isChecked={false}
      onToggle={() => {}}
      onChange={() => {}}
      onSubmit={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
