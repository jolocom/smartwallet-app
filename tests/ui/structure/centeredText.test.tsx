import React from 'react'
import { CenteredText } from 'src/ui/structure/'
import { StyleSheet } from 'react-native'

const ShallowRenderer = require('react-test-renderer/shallow')

describe('generic centeredText component', ()=> {
  it('matches the snapshot with no extra props', () => {
    const renderer = new ShallowRenderer()
    const rendered = renderer.render(<CenteredText msg={ 'test' }/>)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with style prop', () => {
    const renderer = new ShallowRenderer()
    const styles = StyleSheet.create({
      text: {
        width: '30%',
        backgroundColor: 'blue'
      }
    })

    const rendered = renderer.render(
      <CenteredText msg={ 'test' } style={ styles.text } />
    )

    expect(rendered).toMatchSnapshot()
  })

})
