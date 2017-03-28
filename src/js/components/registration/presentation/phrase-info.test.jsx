import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import PhraseInfo from './phrase-info'

describe('(Component) PhraseInfo', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow((<PhraseInfo
        onChange={() => {}}
        onSubmit={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
