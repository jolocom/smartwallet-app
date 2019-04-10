import React from 'react'
import { Container } from 'src/ui/structure/'
import { StyleSheet } from 'react-native'

const ShallowRenderer = require('react-test-renderer/shallow')

describe('generic container component', ()=> {
  it('matches the snapshot with no extra props', () => {
    const renderer = new ShallowRenderer()
    const rendered = renderer.render(<Container> null </Container>)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with style prop', () => {
    const renderer = new ShallowRenderer()
    const styles = StyleSheet.create({
      block: {
        width: '30%',
        backgroundColor: 'blue'
      }
    })

    const rendered = renderer.render(
      <Container style={ styles.block }>
        null
      </Container>
    )
    expect(rendered).toMatchSnapshot()
  })

})
