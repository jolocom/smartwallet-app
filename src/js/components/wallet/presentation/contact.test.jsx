import React from 'react'
import { shallow } from 'enzyme'
import Contact from './contact'

describe('(Component) Contact', function() {
  it('should render properly the first time', function() {
    shallow((<Contact
      focused=""
      information={{}}
      loading
      updateInformation={() => {}}
      deleteInformation={() => {}}
      setInformation={() => {}}
      exitWithoutSaving={() => {}}
      onFocusChange={() => {}}
      saveChanges={() => {}}
      addNewEntry={() => {}}
      confirm={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
